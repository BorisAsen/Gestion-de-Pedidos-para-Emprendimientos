// Importar el modulo enrutador de express
import { Router } from "express";
const router = Router()

//Importar las funciones del CRUD de pedidos
import {
    getAllPedidos,
    getPedidos,
    getMonthYearPedidos,
    getDatePedidos,

    getPedido,
    createPedido,
    updatePedido,
    deletePedido,

    getMonthRevenue,
    getYearRevenue,
    getMonthlySalesAmount,
    getYearlySalesAmount,

 } from "../controllers/pedidos.controllers.js";


// Aqui se construiran todas las rutas relacionadas con el CRUD

// ***************** PEDIDOS ***************** //
// Obtener un unico pedido correspondiente a un id
router.get('/pedido/:id', getPedido);

// Obtener todos los pedidos
router.get('/all_pedidos/:done', getAllPedidos);

// Obtener pedidos del mes actual
router.get('/pedidos/:done', getPedidos);

// Obtener pedidos de un mes y año específico
router.get('/pedidos/:done/:monthYear', getMonthYearPedidos);

// Obtener pedidos de un dia específicomonthly collection
router.get('/pedidosDate/:done/:date', getDatePedidos);


// ****************** VENTAS ****************** //
// Obtener todos las ventas
router.get('/all_ventas/:done', getAllPedidos);

// Obtener ventas del mes actual
router.get('/ventas/:done', getPedidos);

// Obtener ventas de un mes y año específico
router.get('/ventas/:done/:monthYear', getMonthYearPedidos);

// Obtener ventas de un dia específico
router.get('/ventasDate/:done/:date', getDatePedidos);


// ***************** CRUD ***************** //
// Crear pedidos
router.post('/pedidos', createPedido);

// Modificar un pedido mediante un id
router.put('/pedidos/:id', updatePedido);

// Eliminar un pedido correspondiente a un id
router.delete('/pedidos/:id', deletePedido);


// *************** UTILIDAD *************** //
// Obtener el total recaudado en un mes especifico
router.get('/monthly_revenue/:monthYear', getMonthRevenue);

// Obtener el total recaudado en un año especifico
router.get('/yearly_revenue/:year', getYearRevenue);

// Obtener la cantidad de ventas en un mes especifico
router.get('/monthly_sales_amount/:monthYear', getMonthlySalesAmount);

// Obtener la cantidad de ventas en un año especifico
router.get('/yearly_sales_amount/:year', getYearlySalesAmount);

export default router