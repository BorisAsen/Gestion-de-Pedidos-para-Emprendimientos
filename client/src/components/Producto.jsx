import React from 'react'

// Importar el context de productos
import { useGlobalContext } from "../context/ContextProvider";

//Importar el hook para direccionar al formulario de tareas cuando se presione el boton editar
import { useNavigate } from "react-router-dom";

import { useState } from "react";

// Importo iconos de React Icons
import { MdDelete, MdFileDownloadDone } from 'react-icons/md';
import { AiFillEdit } from 'react-icons/ai';

// Ruta de la imagen por defecto
import defaultImage from "../../assets/images/NoImage.jpg";

// El componente recibe un elemento del arreglo de productos
// y muestra todas las propiedades del mismo
export default function ProductCard({ product }) {

    // Extraigo del context las funciones para eliminar un producto
    const {deleteProduct} = useGlobalContext();

    // Declaro constante para disponer del useNavigate
    const navigate = useNavigate();

    // Truncar el titulo si es que es demasiado largo
    const maxLength = 23;
    let title;
    product.productName.length <= maxLength ? title = product.productName : (title = product.productName.slice(0, maxLength) + '...');

    
    // CONFIRMACION DE ELIMINACION
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    // Funcion para cambiar el estado de la variable que muestra el modal de confirmacion de eliminacion
    const handleDelete = () => {
        setShowDeleteConfirmation(true);
    }
    // CONFIRMAR: Se llama a la funcion que elimina el producto y se restablece showDeleteConfirmation a false
    const handleDeleteConfirm = async () => {
        // Llamar a la funcion que se encarga de eliminar el producto segun su id
        deleteProduct(product.id);
        // Restablece el estado de showDeleteConfirmation
        setShowDeleteConfirmation(false);
    };
    // CANCELAR: Se cambia a false el valor de showDelteConfirmation para ocultar el modal
    const handleDeleteCancel = () => {
        setShowDeleteConfirmation(false);
    };

    return (
        <div className='Tarjeta relative'>
            <header className='flex justify-between mb-2'>
                <h2 className='text-xl font-bold h-11 leading-none'>{title}</h2>
            </header>
            <div className="flex justify-center items-center w-full mb-3 bg-white">
                <img className='w-100' src={product.imgURL || defaultImage} alt={title} />
            </div>
            {/* <p className='Tarjeta_field'>URL: {product.imgURL}</p> */}
            {/* <p className='Tarjeta_field'>Public_id: {product.imgPublic_id}</p> */}
            <div className='Tarjeta_field bg-white rounded-md h-24 overflow-y-auto whitespace-pre-wrap'>{(product.description)}</div>
            <p className='Tarjeta_field mb-10'>Precio: ${product.price}</p>
            {/* <p className='Tarjeta_field'><span>C: {product.createdAt}</span></p> */}
            {/* <p className='Tarjeta_field'><span>M: {product.updatedAt}</span></p> */}
            <footer className='absolute bottom-3 flex flex-wrap gap-x-2'>
                <button className='Card-icon' onClick={() => handleDelete()}><MdDelete/></button>
                <button className='Card-icon' onClick={() => navigate(`/editarProducto/${product.id}`)}><AiFillEdit/></button>
            </footer>

            {showDeleteConfirmation && (
            <div>
                <div className='backdrop-blur-md p-3 absolute inset-0 w-full h-full'></div>
                <div className='Tarjeta flex flex-wrap w-10/12 p-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                    <p className='w-full text-center'>¿Estas seguro que deseas eliminar este producto?</p>
                    <div className='w-full flex justify-between'>
                        <button type='buton' className = 'MainButton w-24 mt-2' onClick={handleDeleteConfirm}>Confirmar</button>
                        <button type='buton' className = 'MainButton w-24 mt-2' onClick={handleDeleteCancel}>Cancelar</button>
                    </div>
                </div>
            </div>
            )}
        </div>
  )
}
