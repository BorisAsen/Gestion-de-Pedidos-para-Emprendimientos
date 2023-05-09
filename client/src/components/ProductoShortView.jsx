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
export default function ProductShortView({ product }) {

    // Extraigo del context las funciones para eliminar un producto
    const {deleteProduct} = useGlobalContext();

    // Declaro constante para disponer del useNavigate
    const navigate = useNavigate();

    // Truncar el titulo si es que es demasiado largo
    const maxLength = 10;
    let tittle;
    product.productName.length <= maxLength ? tittle = product.productName : (tittle = product.productName.slice(0, maxLength) + '...');


    return (
        <div className='ProductShortView'>
            <header className='flex justify-between h-7'>
                <h2 className='text-xs font-bold'>{tittle}</h2>
            </header>
            {product.imgURL && <img className='w-100 mb-6' src={product.imgURL}/>}
            
            <footer className='absolute bottom-1.5 flex flex-wrap gap-x-2'>
                <button className='Card-icon' onClick={() => deleteProduct(product.id)}><MdDelete/></button>
                <button className='Card-icon' onClick={() => navigate(`/editarProducto/${product.id}`)}><AiFillEdit/></button>
            </footer>

        </div>
  )
}
