// Funciones para el CRUD de productos

// Importar la conexion a la db
import { pool } from "../dbPostgreSQL.js"

//Importar la funcion de Cloudinary
import { uploadImage, deleteImage } from '../libs/cloudinary.js'

//Importar fs-extra
import fs from 'fs-extra'

// * Funcion para crear un producto
export const createProduct = async (req, res) => {
    try {
        //res.send('Creando productos');
        const {product, description, price} = req.body;

        // Si hay una imagen para subir, se la envia a cloudinary para que la suba
        let image = {
            url: null,
            public_id: null
        };
        if (req.files && req.files.img_url) {
            const result = await uploadImage(req.files.img_url.tempFilePath)
            // Una vez se subio la imagen, se la eliminara de la carpeta temporal
            await fs.remove(req.files.img_url.tempFilePath);
            // De toda la info que brinda el resultado de cloudinary solo se guardan la url de la imagen y el public_id
            image = {
                url: result.secure_url,
                public_id: result.public_id
            }
            console.log(image);
        }

        // Mostrando todos los datos del nuevo producto
        console.log('Nombre: ', product);
        console.log('Ruta Img: ', image.url);
        console.log('Public_id: ', image.public_id);
        console.log('Descripcion: ', description);
        console.log('Precio: ', price);

        const result = await pool.query(
            //created_by hardcodeado con el valor 1
            "INSERT INTO products(product, img_url, img_public_id, description, price, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [product, image.url, image.public_id, description, price, 1]
        );
        console.log('Producto guardado en DB');
        res.json(result.rows[0]);
    } catch (error) {
        /* Devuelve un mensaje de error con estado http 500 que indica
        que se acepto la solicitud pero un error impidio que se cumpliera */
        return res.status(500).json({message: error.message}); 
    } 
}

// Funcion para modificar un producto mediante su id
export const updateProduct = async (req, res) => {
    //res.send('Modificando un producto')

    // Extraigo el valor de los campos del req.body
    const {product, description, price, state} = req.body;

    // Si hay una imagen para subir, se la envia a cloudinary para que la suba
    let image = {
        url: null,
        public_id: null
    };

    // Variable para guardar el resultado de la consulta SQL del UPDATE
    let result = null;
    
    if (req.files && req.files.img_url) {
        // Si se envia una imagen en el req
        // console.log("IMAGEN ENVIADA")

        // Se sube la imagen
        const resultUpload = await uploadImage(req.files.img_url.tempFilePath)
        // Una vez se subio la imagen, se la eliminara de la carpeta temporal
        await fs.remove(req.files.img_url.tempFilePath);
        // De toda la info que brinda el resultado de cloudinary solo se guardan la url de la imagen y su public_id
        image = {
            url: resultUpload.secure_url,
            public_id: resultUpload.public_id
        }
        console.log(image);

        // Como existe una nueva imagen para subir, se debe eliminar de cloudinary la anterior
        // Primero se debe encontrar el imgPublic_id de cloudinary que tiene la imagen antigua del producto
        const [product] = await pool.query("SELECT * FROM products WHERE product_id = ?", [req.params.product_id]);
        let cloudinaryImgPublic_id = product[0].img_public_id; // Si no tenia imagen, la variable tomara el valor de null
        
        // Ahora, en el caso de que el producto haya tenido una imagen anteriormente se la eliminara porque ya no es necesaria
        if (cloudinaryImgPublic_id) {
            await deleteImage(cloudinaryImgPublic_id);
        }

        // Ejecutar el UPDATE incluyendo la nueva imagen del producto
        const result = await pool.query(
            "UPDATE products SET product = $1, img_url = $2, img_public_id = $3, description = $4, price = $5, modified_at = localtimestamp(0), modified_by = $6, state = $7 WHERE product_id = $8 RETURNING *",
            [product, image.url, image.public_id, description, price, 1, state, req.params.product_id]
        );
    } else {
        // Si NO se envia una imagen en el req
        // console.log("IMAGEN NO ENVIADA");

        // Si se desea quitar la imagen del producto
        if (req.body.img_url === "DELETE_IMAGE") {
            // Eliminar la imagen del producto
            const [product] = await pool.query("SELECT * FROM products WHERE product_id = ?", [req.params.product_id]);
            let cloudinaryImgPublic_id = product[0].img_public_id;
            
            if (cloudinaryImgPublic_id) {
              await deleteImage(cloudinaryImgPublic_id);
            }
            
            // Actualizar el producto eliminando la imagen
            result = await pool.query("UPDATE products SET product = $1, description = $2, price = $3, img_url = NULL, img_public_id = NULL, modified_at = localtimestamp(0), modified_by = $4, state = $5 WHERE product_id = $6  RETURNING *", [product, description, price, 1, state, req.params.product_id]);
          } else {
            // Si no se envía una nueva imagen ni una solicitud de eliminacion de la misma, se mantiene la imagen que ya tenia 
            // Se ejecuta el update sin modificar los campos que contiene la informacion de la imagen
            result = await pool.query(
                "UPDATE products SET product = $1, description = $2, price = $3, modified_at = localtimestamp(0), modified_by = $4, state = $5 WHERE product_id = $6  RETURNING *",
                [product, description, price, 1, state, req.params.product_id]);
          }
      }
    
    /* 
       De la misma manera que al eliminar un producto hay que controlar que exista,
       lo mismo debe suceder al intentar modificarlo
    */
    if (result.affectedRows === 0) {
        return res.status(404).json({message: "Producto no encontrado"});
    };
    //Devolver mensaje de exito y el producto actualizado
    return res.status(200).json({
        message: "Producto actualizado con éxito",
        updatedProduct: result.rows[0]
    });
}

// Funcion para obtener todos los productos de la db
export const getProducts = async (req, res) => {
    try {
        //res.send('Obteniendo productos')
        const result = await pool.query("SELECT * FROM products WHERE state = 'active' ORDER BY created_at DESC");
        // Devuelve un arreglo con todos los productos
        //console.log(result);
        //console.log("Obteniendo productos...")
        res.json(result.rows);
    } catch (error) {
        // Retornar el mensaje de error como respuesta
        return res.status(500).json({message: error.message});
    }
}

// Función para obtener solo los productos inactivos de la base de datos
export const getInactiveProducts = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM products WHERE state = 'inactive' ORDER BY created_at DESC");
        res.json(result.rows); // Devuelve un arreglo con los productos inactivos
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Funcion para obtener un producto mediante su id
export const getProduct = async (req, res) => {
    try {
        //res.send('Obteniendo un producto')
        const result = await pool.query("SELECT * FROM products WHERE product_id = $1", [req.params.product_id]);
        // Devuelve un arreglo de un solo producto que coincide con el ID solicitado
        // Controlar que se devuelva un resultado de error si no existe el id solicitado
        // Como se esta buscando por id, el resultado sera siempre unico,
        // Por lo que indico que el resultado sera el primer elemento del arreglo
        if (result.rows.length === 0) {
            return res.status(404).json({message: "Producto no encontrado"});
        }else{
            console.log('Producto encontrado');
            return res.status(200).json({product: result.rows[0]});
        }
    } catch (error) {
        // Retornar el mensaje de error como respuesta
        return res.status(500).json({message: error.message});
    }
}

// Funcion para eliminar un producto mediante su id
export const deleteProduct = async (req, res) => {
    try {
        // Verificar si existe el producto a eliminar
        const product = await pool.query("SELECT * FROM products WHERE product_id = $1", [req.params.product_id]);
        if (product.rows.length === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        // Determinar si el producto esta asociado a algun pedido
        const isProductInOrders = await checkProductInOrders(req.params.product_id);

        // Determinar si sera un borrado logico o fisico 
        if (isProductInOrders) {
            // Producto asociado a pedidos, cambiar active a false
            await pool.query("UPDATE products SET state = $1 WHERE product_id = $2", ['inactive', req.params.product_id]);
            console.log('Producto inactivado');
            return res.sendStatus(204); // Producto desactivado con éxito
        } else {
            // No asociado a pedidos, eliminar físicamente
            const cloudinaryImgPublic_id = product.rows[0].img_public_id;
            await pool.query("DELETE FROM products WHERE product_id = $1", [req.params.product_id]);

            if (cloudinaryImgPublic_id) {
                await deleteImage(cloudinaryImgPublic_id);
            }
            console.log('Producto eliminado');
            return res.sendStatus(204); // Producto eliminado con éxito
        }  
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Funcion para checkear si un producto esta asociado a uno o mas pedidos
async function checkProductInOrders(productId) {
    const ordersCount = await pool.query("SELECT COUNT(*) AS count FROM orders_products WHERE product_id = $1", [productId]);
    return ordersCount.rows[0].count > 0;
}

// Función para restaurar un producto
export const restoreProduct = async (req, res) => {
    try {
        // Verificar si existe el producto a restaurar
        const product = await pool.query("SELECT * FROM products WHERE product_id = $1", [req.params.product_id]);
        if (product.rows.length === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // Restaurar el producto (cambiar active a true)
        const result = await pool.query("UPDATE products SET state = $1 WHERE product_id = $2 RETURNING *", ['active', req.params.product_id]);
        console.log('Producto restaurado');
        return res.sendStatus(204); // Producto restaurado con éxito
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// * Funcion para obtener productos mediante coincidencias en el campo productName
export const getProducts_productName = async (req, res) => {
    try {
        //res.send('Obteniendo productos mediante el nombre...')
        const { product } = req.query;
        console.log('Buscando productos con la coincidencia en el nombre: ', product);
        const result = await pool.query("SELECT * FROM products WHERE product ILIKE $1", [`%${product}%`]);
        // Devuelve un arreglo con todos los productos
        //console.log(result);
        res.json(result.rows); 
    } catch (error) {
        // Retornar el mensaje de error como respuesta
        return res.status(500).json({message: error.message});
    }
}