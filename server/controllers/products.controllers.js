// Funciones para el CRUD de productos

import path, { dirname } from 'path';
import { fileURLToPath } from "url";
import multer from 'multer';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Importar la conexion a la db
import { pool } from "../db.js"

// * Funcion para crear un producto
export const createProduct = async (req, res) => {
    try {
        //res.send('Creando productos');
        const {productName, imgURL, description, price} = req.body;
        //const imagen = req.file
        
        //var url = `http://localhost:4000/images/${imgURL}`;
        //var url = path.join(__dirname, '../public/ImgProducts', imgURL);
        //console.log(imagen.filename);
        // console.log(path.join(__dirname, '../public/ImgProducts', url));
        const [result] = await pool.query(
            "INSERT INTO products(productName, imgURL, description, price) VALUES (?, ?, ?, ?)",
            [productName, imgURL, description, price]
        );
        res.json({
            id: result.insertId,
            productName,
            imgURL,
            description,
            price
        });
    } catch (error) {
        /* Devuelve un mensaje de error con estado http 500 que indica
        que se acepto la solicitud pero un error impidio que se cumpliera */
        return res.status(500).json({message: error.message}); 
    }
    
}

// * Funcion para obtener todos los productos de la db
export const getProducts = async (req, res) => {
    try {
        //res.send('Obteniendo productos')
        const [result] = await pool.query("SELECT * FROM products ORDER BY createdAt DESC");
        // Devuelve un arreglo con todos los productos
        //console.log(result);
        console.log("Obteniendo productos...")
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
        /* 
        Aca, si bien no es necesario devolver un resultado luego de eliminar un producto,
        Se utilizara el result.affectedRows para saber si el producto que se desea eliminar
        realmente existe en la db, en el caso de no hacerlo se devolvera un msg de error
        */
        const [result] = await pool.query("DELETE FROM products WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({message: "Producto no encontrado"});
        };
        // En el caso de si haber existido el producto, el estado sera 204 indicando que se
        // elimino correctamente pero no devuelve ningun resultado
        return res.sendStatus(204);
    } catch (error) {
        // Retornar el mensaje de error como respuesta
        return res.status(500).json({message: error.message});
    }


}

// Funcion para modificar un producto mediante su id
export const updateProduct = async (req, res) => {
    //res.send('Modificando un producto')
    // Los datos de los campos a modificar se obtienen del req.body
    const result = await pool.query("UPDATE products SET ? WHERE id = ?", [req.body, req.params.id]);
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