// Importo axios
import axios from "axios";

// Funcion para enviar la peticion get que trae todos los productos
export const getProductsRequest = async () =>
    await axios.get("http://localhost:4000/products");

// Funcion para traer un unico prodcuto mediante el id
export const getProductRequest = async (id) =>
    await axios.get(`http://localhost:4000/products/${id}`);

// Funcion para crear un producto, recibe un objeto tipo product y lo guarda
export const createProductRequest = async (product) =>
    await axios.post("http://localhost:4000/products", product);

// Funcion para enviar una peticion delete mediante el id del producto a borrar
export const deleteProductRequest = async (id) =>
    await axios.delete(`http://localhost:4000/products/${id}`);

// Funcion para modificar un producto, recibe su id y los nuevos valores
export const updateProductRequest = async (id, newFields) => 
    await axios.put(`http://localhost:4000/products/${id}`, newFields);
