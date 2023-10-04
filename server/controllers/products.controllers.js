// Funciones para el CRUD de productos

// Importar la conexion a la db
import { pool } from "../db.js"

//Importar la funcion de Cloudinary
import { uploadImage, deleteImage } from '../libs/cloudinary.js'

//Importar fs-extra
import fs from 'fs-extra'

// * Funcion para crear un producto
export const createProduct = async (req, res) => {
    try {
        //res.send('Creando productos');
        const {productName, description, price} = req.body;

        // Si hay una imagen para subir, se la envia a cloudinary para que la suba
        let image = {
            url: null,
            public_id: null
        };
        if (req.files && req.files.imgURL) {
            const result = await uploadImage(req.files.imgURL.tempFilePath)
            // Una vez se subio la imagen, se la eliminara de la carpeta temporal
            await fs.remove(req.files.imgURL.tempFilePath);
            // De toda la info que brinda el resultado de cloudinary solo se guardan la url de la imagen y su public_id
            image = {
                url: result.secure_url,
                public_id: result.public_id
            }
            console.log(image);
        }

        // Mostrando todos los datos del nuevo producto
        console.log('Nombre: ', productName);
        console.log('Ruta Img: ', image.url);
        console.log('Public_id: ', image.public_id);
        console.log('Descripcion: ', description);
        console.log('Precio: ', price);

        const [result] = await pool.query(
            "INSERT INTO products(productName, imgURL, imgPublic_id, description, price) VALUES (?, ?, ?, ?, ?)",
            [productName, image.url, image.public_id, description, price]
        );
        console.log('Producto guardado en DB');
        res.json({
            id: result.insertId,
            productName,
            imgURL: image.url,
            imgPublic_id: image.public_id,
            description,
            price
        });
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
    const {productName, description, price} = req.body;

    // Si hay una imagen para subir, se la envia a cloudinary para que la suba
    let image = {
        url: null,
        public_id: null
    };

    // Variable para guardar el resultado de la consulta SQL del UPDATE
    let result = null;
    
    if (req.files && req.files.imgURL) {
        const resultUpload = await uploadImage(req.files.imgURL.tempFilePath)
        // Una vez se subio la imagen, se la eliminara de la carpeta temporal
        await fs.remove(req.files.imgURL.tempFilePath);
        // De toda la info que brinda el resultado de cloudinary solo se guardan la url de la imagen y su public_id
        image = {
            url: resultUpload.secure_url,
            public_id: resultUpload.public_id
        }
        console.log(image);

        // Como existe una nueva imagen para subir, se debe eliminar de cloudinary la anterior
        // Primero se debe encontrar el imgPublic_id de cloudinary que tiene la imagen antigua del producto
        const [product] = await pool.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
        let cloudinaryImgPublic_id = product[0].imgPublic_id; // Si no tenia imagen, la variable tomara el valor de null
        
        // Ahora, en el caso de que el producto haya tenido una imagen anteriormente se la eliminara porque ya no es necesaria
        if (cloudinaryImgPublic_id) {
            await deleteImage(cloudinaryImgPublic_id);
        }

        // Ejecutar el UPDATE incluyendo la nueva imagen del producto
        result = await pool.query("UPDATE products SET productName = ?, imgURL = ?, imgPublic_id = ?, description = ?, price = ? WHERE id = ?", [productName, image.url, image.public_id, description, price, req.params.id]);
    } else {
        // En este caso, no se incluyó una nueva imagen en el req, por lo que se verificara si el producto ya contaba con una imagen
        const [product] = await pool.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
        let cloudinaryImgPublic_id = product[0].imgPublic_id; // Si no tenia imagen, la variable tomará el valor de null
    
        if (cloudinaryImgPublic_id) {
          // Si tenia imagen, se elimina de Cloudinary y se actualiza el registro en la base de datos
          await deleteImage(cloudinaryImgPublic_id);
    
          // Se actualiza el producto limpiando el contenido anterior de la imagen (imgURL e imgPublic_id )
          result = await pool.query("UPDATE products SET productName = ?, description = ?, price = ?, imgURL = NULL, imgPublic_id = NULL WHERE id = ?", [productName, description, price, req.params.id]);
        } else {
          // Si no había una imagen anterior, simplemente actualizamos el registro en la base de datos excluyendo el campo imgURL.
          result = await pool.query("UPDATE products SET productName = ?, description = ?, price = ? WHERE id = ?", [productName, description, price, req.params.id]);
        }
      }
    
    /* 
       De la misma manera que al eliminar un producto hay que controlar que exista,
       lo mismo debe suceder al intentar modificarlo
    */
    if (result.affectedRows === 0) {
        return res.status(404).json({message: "Producto no encontrado"});
    };
    // En el caso de si haber existido el producto, el estado sera 204 indicando que se
    // actualizo correctamente pero no devuelve ningun resultado
    return res.sendStatus(204);
}

// * Funcion para obtener todos los productos de la db
export const getProducts = async (req, res) => {
    try {
        //res.send('Obteniendo productos')
        const [result] = await pool.query("SELECT * FROM products ORDER BY createdAt DESC");
        // Devuelve un arreglo con todos los productos
        //console.log(result);
        //console.log("Obteniendo productos...")
        res.json(result); 
    } catch (error) {
        // Retornar el mensaje de error como respuesta
        return res.status(500).json({message: error.message});
    }
    
}

// * Funcion para obtener un producto mediante su id
export const getProduct = async (req, res) => {
    try {
        //res.send('Obteniendo un producto')
        const [result] = await pool.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
        // Devuelve un arreglo de un solo producto que coincide con el ID solicitado
        console.log(result);
        // Controlar que se devuelva un resultado de error si no existe el id solicitado
        if (result.length === 0) {
            return res.status(404).json({message: "Producto no encontrado"});
        };
        // Como se esta buscando por id, el resultado sera siempre unico,
        // Por lo que indico que el resultado sera el primer elemento del arreglo
        res.json(result[0]);
    } catch (error) {
        // Retornar el mensaje de error como respuesta
        return res.status(500).json({message: error.message});
    }
}

// Funcion para eliminar un producto mediante su id
export const deleteProduct = async (req, res) => {
    try {
        //res.send('Eliminando un producto')

        // Primero se debe encontrar el imgPublic_id de cloudinary que tiene la imagen del producto
        const [product] = await pool.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
        let cloudinaryImgPublic_id = product[0].imgPublic_id; // En caso de no tener imagen, la variable tomara el valor de null

        /* 
        Aca, si bien no es necesario devolver un resultado luego de eliminar un producto,
        Se utilizara el result.affectedRows para saber si el producto que se desea eliminar
        realmente existe en la db, en el caso de no hacerlo se devolvera un msg de error
        */
        const [result] = await pool.query("DELETE FROM products WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) {
            // NO EXISTE EL PRODUCTO
            return res.status(404).json({message: "Producto no encontrado"});
        } else {
            // SI EXISTE EL PRODUCTO
            // Con el public_id de cloudinary se ejecuta la funcion para eliminar la imagen en el caso de tener
            if (cloudinaryImgPublic_id) {
                await deleteImage(cloudinaryImgPublic_id);
            }
            console.log('Producto Eliminado');
            // Finalmente el estado sera 204 indicando que se elimino correctamente pero no devuelve ningun resultado
            return res.sendStatus(204);
        }
        
    } catch (error) {
        // Retornar el mensaje de error como respuesta
        return res.status(500).json({message: error.message});
    }
}

// * Funcion para obtener productos mediante coincidencias en el campo productName
export const getProducts_productName = async (req, res) => {
    try {
        //res.send('Obteniendo productos mediante el nombre...')
        const { productName } = req.query;
        console.log('Buscando productos con la coincidencia en el nombre: ', productName);
        const [result] = await pool.query("SELECT * FROM products WHERE productName LIKE ?", [`%${productName}%`]);
        // Devuelve un arreglo con todos los productos
        //console.log(result);
        res.json(result); 
    } catch (error) {
        // Retornar el mensaje de error como respuesta
        return res.status(500).json({message: error.message});
    }
    
}