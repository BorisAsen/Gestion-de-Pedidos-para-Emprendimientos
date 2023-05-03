// Importar el modulo enrutador de express
import { Router } from "express";
const router = Router()

//Importar las funciones del CRUD de pedidos
import { 
    getPedidos,
    getPedido,
    createPedido,
    updatePedido,
    deletePedido
 } from "../controllers/pedidos.controllers.js";


// Aqui se construiran todas las rutas relacionadas con el CRUD

// Obtener pedidos de la db para mostrarlos
router.get('/pedidos', getPedidos);

// Obtener un unico pedido correspondiente a un id
router.get('/pedidos/:id', getPedido);

// Crear pedidos
router.post('/pedidos', createPedido);

// Modificar un pedido mediante un id
router.put('/pedidos/:id', updatePedido);

// Eliminar un pedido correspondiente a un id
router.delete('/pedidos/:id', deletePedido);




export default router