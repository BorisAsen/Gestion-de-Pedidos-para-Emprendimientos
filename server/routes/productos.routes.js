// Importar el modulo enrutador de express
import { Router } from "express";
const router = Router();

//Importar las funciones del CRUD de productos
import { 
    getProducts,
    getInactiveProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    restoreProduct,
    getProducts_productName
 } from "../controllers/products.controllers.js";
import { getProductByProductNameRequest } from "../../client/src/api/productos.api.js";

// Aqui se construiran todas las rutas relacionadas con el CRUD de PRODUCTOS

// Obtener productos de la db para mostrarlos
router.get('/products', getProducts);

// Obtener productos inactivos de la db
router.get('/products/inactive', getInactiveProducts);

// Obtener productos mediante coincidencias en el nombre del mismo
router.get('/products/search', getProducts_productName);
// Es importante definir la ruta de busqueda antes de la de obtener un
// producto mediante su id porque sino esta entraria en conflicto e
// inutilizaria la ruta de busqueda

// Obtener un unico producto correspondiente a un id
router.get('/products/:id', getProduct);

// Crear productos
router.post('/products', createProduct); 

// Modificar un producto mediante un id
router.put('/products/:id', updateProduct);

// Eliminar un producto correspondiente a un id
router.delete('/products/:id', deleteProduct);

// Ruta para restaurar un producto mediante su ID
router.put('/products/restore/:id', restoreProduct);



export default router