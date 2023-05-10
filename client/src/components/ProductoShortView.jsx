import React from 'react'

// Importar el context de productos
import { useGlobalContext } from "../context/ContextProvider";

//Importar el hook para direccionar al formulario de tareas cuando se presione el boton editar
import { useNavigate } from "react-router-dom";

import { useState } from "react";

// Importo iconos de React Icons
import { MdDelete, MdFileDownloadDone } from 'react-icons/md';
import { AiFillEdit } from 'react-icons/ai';

// El componente recibe un elemento del arreglo de productos
// y muestra todas las propiedades del mismo
export default function ProductShortView({ product }) {

    // Extraigo del context el arreglo de items (productos y sus cantidades)
    // Y las funciones para agregar y quitar items del arreglo
    const {items, addItem, removeItem} = useGlobalContext();

    // Truncar el titulo si es que es demasiado largo
    const maxLength = 10;
    let tittle;
    product.productName.length <= maxLength ? tittle = product.productName : (tittle = product.productName.slice(0, maxLength) + '...');

    // Agregar el producto al arreglo de items
    const [selectedProduct, setSelectedProduct] = useState(false);
    const handleClick = () => {
        // Cambiar el estado al hacer click
        setSelectedProduct(!selectedProduct);
        // Si el producto esta seleccionado se lo agrega al arreglo de items
        // Si no esta seleccionado se lo quita del arreglo de items
        !selectedProduct ? addItem(product, 1) : removeItem(product);
    };

    // Controlar si el producto esta en el arreglo de items para darle un estilo que resalte 
    let resaltar = false;
    function isProductSelected() {
        items.some((item) => item.product === product) ? resaltar = true : resaltar = false;
    }
    isProductSelected();

    return (
        <div className={`ProductShortView ${resaltar ? 'bg-details_3' : null}`} onClick={handleClick}>
            <header className='flex justify-between h-7 mb-1'>
                <h2 className={`text-xs font-bold ${resaltar ? 'text-white' : null}`}>{tittle}</h2>
            </header>
            {/* {product.imgURL && <img className='w-100 mb-6' src={product.imgURL}/>} */}
            {product.imgURL && <img className='w-100' src={product.imgURL}/>}
            
            {/* <footer className='absolute bottom-1.5 flex flex-wrap gap-x-2'>
                <button className='Card-icon' onClick={() => deleteProduct(product.id)}><MdDelete/></button>
                <button className='Card-icon' onClick={() => navigate(`/editarProducto/${product.id}`)}><AiFillEdit/></button>
            </footer> */}

        </div>
  )
}
