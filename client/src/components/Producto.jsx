import React from 'react'

// Importar el context de productos
import { useGlobalContext } from "../context/ContextProvider";

//Importar el hook para direccionar al formulario de tareas cuando se presione el boton editar
import { useNavigate } from "react-router-dom";

// Importo iconos de React Icons
import { MdDelete, MdFileDownloadDone } from 'react-icons/md';
import { AiFillEdit } from 'react-icons/ai';

// El componente recibe un elemento del arreglo de productos
// y muestra todas las propiedades del mismo
export default function ProductCard({ product }) {

    // Extraigo del context las funciones para eliminar un producto
    const {deleteProduct} = useGlobalContext();

    // Declaro constante para disponer del useNavigate
    const navigate = useNavigate();

    return (
        <div className='Tarjeta relative'>
            <header className='flex justify-between mb-2'>
                <h2 className='text-xl font-bold h-12 overflow-auto'>{product.productName}</h2>
            </header>
            {product.imgURL && <img className='w-100 mb-3' src={product.imgURL}/>}
            {/* <p className='Tarjeta_field'>URL: {product.imgURL}</p> */}
            {/* <p className='Tarjeta_field'>Public_id: {product.imgPublic_id}</p> */}
            <div className='Tarjeta_field bg-white rounded-md h-24 overflow-y-auto whitespace-pre-wrap'>{(product.description)}</div>
            <p className='Tarjeta_field mb-10'>Precio: ${product.price}</p>
            {/* <p className='Tarjeta_field'><span>C: {product.createdAt}</span></p> */}
            {/* <p className='Tarjeta_field'><span>M: {product.updatedAt}</span></p> */}
            <footer className='absolute bottom-3 flex flex-wrap gap-x-2'>
                <button className='TaskCard-icon' onClick={() => deleteProduct(product.id)}><MdDelete/></button>
                <button className='TaskCard-icon' onClick={() => navigate(`/editProducto/${product.id}`)}><AiFillEdit/></button>
            </footer>

        </div>
  )
}
