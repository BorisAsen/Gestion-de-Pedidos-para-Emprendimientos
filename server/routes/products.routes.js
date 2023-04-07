// Importar el modulo enrutador de express
import { Router } from "express";
const router = Router()

// Multer para subir las imagenes de cada producto
import { storage } from  '../middlewares/multer.js';
import multer from 'multer';
const uploader = multer({storage});

//Importar las funciones del CRUD de productos
import { 
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
 } from "../controllers/products.controllers.js";

// Aqui se construiran todas las rutas relacionadas con el CRUD de PRODUCTOS

// Obtener productos de la db para mostrarlos
router.get('/products', getProducts);

// Obtener un unico producto correspondiente a un id
router.get('/products/:id', getProduct);

// Crear productos
// Se utiliza el multer como middleware para guardar la imagen en el sv y luego guardar el producto en la base de datos
// 'imgURl' debe coincidir con el name del input que toma la imagen en el form de productos
router.post('/products', uploader.single('imgURL'), createProduct);

// Modificar un producto mediante un id
router.put('/products/:id', updateProduct);

// Eliminar un producto correspondiente a un id
router.delete('/products/:id', deleteProduct);



export default router