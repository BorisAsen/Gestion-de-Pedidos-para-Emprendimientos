// Importo axios
import axios from "axios";

// Funcion para enviar la peticion get que trae todos los pedidos
export const getPedidosRequest = async () => 
    await axios.get("http://localhost:4000/pedidos");

// Funcion para traer un unico pedido mediante el id
export const getPedidoRequest = async (id) =>
    await axios.get(`http://localhost:4000/pedidos/${id}`);

// Funcion para crear una tarea, recibe un objeto tipo task y lo guarda
export const createPedidoRequest = async (task) => 
    await axios.post("http://localhost:4000/pedidos", task);

// Funcion para enviar una peticion delete mediante el id de la tarea a borrar
export const deletePedidoRequest = async (id) =>
    await axios.delete(`http://localhost:4000/pedidos/${id}`);

// Funcion para modificar una tarea, recibe su id y los nuevos valores
export const updatePedidoRequest = async (id, newFields) => 
    await axios.put(`http://localhost:4000/pedidos/${id}`, newFields);

// Funcion para cambiar el estado (done) de una tarea segun el id de la misma
export const togglePedidoDoneRequest = async (id, done) =>
    await axios.put(`http://localhost:4000/pedidos/${id}`, {done,});
