// Importo axios
import axios from "axios";

// Funcion para enviar la peticion get que trae todos los pedidos
export const getPedidosRequest = async () => 
    await axios.get("http://localhost:4000/pedidos");

// Funcion para traer un unico pedido mediante el id
export const getPedidoRequest = async (id) =>
    await axios.get(`http://localhost:4000/pedidos/${id}`);

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
