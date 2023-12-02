// Importo axios
import axios from "axios";

// Funcion para enviar la peticion get que trae todos los productos
export const getProductsRequest = async () =>
    await axios.get("http://localhost:4000/products");

// Función para obtener productos inactivos
export const getInactiveProductsRequest = async () =>
await axios.get("http://localhost:4000/products/inactive");

// Funcion para traer productos mediante una coincidencia de sus nombres y el termino buscado
export const getProductByProductNameRequest = async (productName) =>
    await axios.get(`http://localhost:4000/products/search?productName=${productName}`);

// Funcion para traer un unico producto mediante el id
export const getProductRequest = async (id) =>
    await axios.get(`http://localhost:4000/products/${id}`);

// Funcion para crear un producto, recibe un objeto tipo product y lo guarda
export const createProductRequest = async (product) => {
    const form = new FormData();

    for (let key in product) {
        form.append(key, product[key])
    }
    return await axios.post("http://localhost:4000/products", form, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}

// Funcion para modificar un producto, recibe su id y los nuevos valores
export const updateProductRequest = async (id, updateProduct) => {
    const form = new FormData();

    for (let key in updateProduct) {
        form.append(key, updateProduct[key])
    }
    return await axios.put(`http://localhost:4000/products/${id}`, form, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}

// Funcion para enviar una peticion delete mediante el id del producto a borrar
export const deleteProductRequest = async (id) =>
    await axios.delete(`http://localhost:4000/products/${id}`);

// Función para restaurar un producto
export const restoreProductRequest = async (id) =>
await axios.put(`http://localhost:4000/products/restore/${id}`);
    


