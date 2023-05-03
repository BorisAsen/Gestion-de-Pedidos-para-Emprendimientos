// Importar el modulo enrutador de express
import { Router } from "express";
const router = Router();

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
router.post('/products', createProduct); 

// Modificar un producto mediante un id
router.put('/products/:id', updateProduct);

// Eliminar un producto correspondiente a un id
router.delete('/products/:id', deleteProduct);



export default router