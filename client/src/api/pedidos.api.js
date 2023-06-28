// Importo axios
import axios from "axios";

// ***************** PEDIDOS ***************** //
// Funcion para traer un unico pedido mediante el id
export const getPedidoRequest = async (id) =>
    await axios.get(`http://localhost:4000/pedido/${id}`);

// Funcion para enviar la peticion get que trae todos los pedidos del mes actual
export const getPedidosRequest = async () => 
    await axios.get("http://localhost:4000/pedidos/0");

// Funcion para enviar la peticion get que trae todos los pedidos
export const getAllPedidosRequest = async () => 
await axios.get("http://localhost:4000/all_pedidos/0");

// Funcion para enviar la peticion get que trae todos los pedidos de un mes y año especificos
export const getMonthYearPedidosRequest = async (monthYear) => 
await axios.get(`http://localhost:4000/pedidos/0/${monthYear}`);

// Funcion para enviar la peticion get que trae todos los pedidos de un dia especifico
export const getDatePedidosRequest = async (date) => 
await axios.get(`http://localhost:4000/pedidosDate/0/${date}`);


// ****************** VENTAS ****************** //
// Funcion para enviar la peticion get que trae todos las ventas del mes  actual
export const getVentasRequest = async () => 
await axios.get("http://localhost:4000/ventas/1");

// Funcion para enviar la peticion get que trae todos las ventas
export const getAllVentasRequest = async () => 
await axios.get("http://localhost:4000/all_ventas/1");

// Funcion para enviar la peticion get que trae todas las ventas de un mes y año especificos
export const getMonthYearVentasRequest = async (monthYear) => 
await axios.get(`http://localhost:4000/ventas/1/${monthYear}`);

// Funcion para enviar la peticion get que trae todos las ventas de un dia especifico
export const getDateVentasRequest = async (date) => 
await axios.get(`http://localhost:4000/ventasDate/1/${date}`);


// ***************** CRUD ***************** //
// Funcion para crear una pedido, recibe un objeto tipo pedido y lo guarda
export const createPedidoRequest = async (pedido) => 
    await axios.post("http://localhost:4000/pedidos", pedido);

// Funcion para enviar una peticion delete mediante el id del pedido a borrar
export const deletePedidoRequest = async (id) =>
    await axios.delete(`http://localhost:4000/pedidos/${id}`);

// Funcion para modificar un pedido, recibe su id y los nuevos valores
export const updatePedidoRequest = async (id, newFields) => 
    await axios.put(`http://localhost:4000/pedidos/${id}`, newFields);

// Funcion para cambiar el estado (done) de un pedido segun su id
export const togglePedidoDoneRequest = async (id, done) =>
    await axios.put(`http://localhost:4000/pedidos/${id}`, {done,});


// *************** UTILIDAD *************** //
// Funcion para obtener el total recaudado en un mes especifico
export const getMonthRevenueRequest = async (monthYear) => 
await axios.get(`http://localhost:4000/monthly_revenue/${monthYear}`);

// Funcion para obtener el total recaudado en un año especifico
export const getYearRevenueRequest = async (year) =>
await axios.get(`http://localhost:4000/yearly_revenue/${year}`);

// Funcion para obtener la cantidad de ventas en un mes especifico
export const getMonthlySalesAmountRequest = async (monthYear) =>
await axios.get(`http://localhost:4000/monthly_sales_amount/${monthYear}`);

// Funcion para obtener la cantidad de ventas en un año especifico
export const getYearlySalesAmountRequest = async (year) =>
await axios.get(`http://localhost:4000/yearly_sales_amount/${year}`);

// Funcion para obtener los productos mas vendidos de un mes especifico
export const getMonthlyBestSellingProductsRequest = async (monthYear) =>
await axios.get(`http://localhost:4000/best_selling_products_month/${monthYear}`);

// Funcion para obtener los productos mas vendidos de un año especifico
export const getYearlyBestSellingProductsRequest = async (year) =>
await axios.get(`http://localhost:4000/best_selling_products_year/${year}`);
