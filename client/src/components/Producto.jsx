import React from 'react'

// Importar el context de productos
import { useGlobalContext } from "../context/ContextProvider";

//Importar el hook para direccionar al formulario de tareas cuando se presione el boton editar
import { useNavigate } from "react-router-dom";

import { useState } from "react";

// Importo iconos de React Icons
import { MdDelete, MdOutlineRestoreFromTrash } from 'react-icons/md';
import { AiFillEdit } from 'react-icons/ai';

// Ruta de la imagen por defecto
import defaultImage from "../../assets/images/NoImage.jpg";

// El componente recibe un elemento del arreglo de productos
// y muestra todas las propiedades del mismo

export default function ProductCard({ product }) {
    // Extraigo del context las funciones para eliminar y restaurar un producto
    const { deleteProduct, restoreProduct } = useGlobalContext();

     // Declaro constante para disponer del useNavigate
    const navigate = useNavigate();

    // Estado para mostrar la confirmacion de eliminacion o restauracion
    const [showDeleteOrRestoreConfirmation, setShowDeleteOrRestoreConfirmation] = useState(false);

    // Truncar el titulo si es que es demasiado largo
    const maxLength = 23;
    let title;
    product.productName.length <= maxLength ? title = product.productName : (title = product.productName.slice(0, maxLength) + '...');

    // Handler para la confirmacion
    const handleDeleteOrRestore = () => {
        setShowDeleteOrRestoreConfirmation(true);
    };

    // Confirmar
    const handleDeleteOrRestoreConfirm = async () => {
        setShowDeleteOrRestoreConfirmation(false);
        if (product.active) {
            deleteProduct(product.id);
        } else {
            restoreProduct(product.id);
            window.location.reload(); // Recargar la página después de restaurar el producto
        }
    };

    // Cancelar
    const handleDeleteOrRestoreCancel = () => {
        setShowDeleteOrRestoreConfirmation(false);
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
                <button className='Card-icon' onClick={() => handleDeleteOrRestore()}>{product.active ? <MdDelete/> : <MdOutlineRestoreFromTrash/>}</button>
                <button className='Card-icon' onClick={() => navigate(`/editarProducto/${product.id}`)}><AiFillEdit/></button>
            </footer>

            {showDeleteOrRestoreConfirmation && (
                <div>
                    <div className='backdrop-blur-md p-3 absolute inset-0 w-full h-full'></div>
                    <div className='Tarjeta flex flex-wrap w-10/12 p-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                        <p className='w-full text-center'>
                            {product.active ? '¿Estás seguro que deseas eliminar este producto?' : '¿Estás seguro que deseas restaurar este producto?'}
                        </p>
                        <div className='w-full flex justify-between'>
                            <button type='button' className='MainButton w-24 mt-2' onClick={handleDeleteOrRestoreConfirm}>
                                {product.active ? 'Confirmar' : 'Restaurar'}
                            </button>
                            <button type='button' className='MainButton w-24 mt-2' onClick={handleDeleteOrRestoreCancel}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
