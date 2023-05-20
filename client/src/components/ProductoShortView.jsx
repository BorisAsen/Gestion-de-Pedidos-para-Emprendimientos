import React from 'react'

// Importar el context de productos
import { useGlobalContext } from "../context/ContextProvider";

// Importar el hook useEffect para mostrar informacion ni bien se carga la pagina
import { useEffect } from "react";

// Importo iconos de React Icons
import { MdDelete, MdFileDownloadDone } from 'react-icons/md';
import { AiFillEdit } from 'react-icons/ai';

// El componente recibe un producto y el arreglo de items del pedido
export default function ProductShortView({ product, itemsReceived }) {

    // Extraigo del context el arreglo de items (productos y sus cantidades)
    // Y las funciones para agregar y quitar items del arreglo
    const {items, setItems, addItem, removeItem} = useGlobalContext();

    // Se ejecuta al cargar el componente
    useEffect(() => {
        const loadItems = async () => {
            setItems(itemsReceived);
        };
        loadItems();
    }, [])

    // Truncar el titulo si es que es demasiado largo
    const maxLength = 10;
    let tittle;
    product.productName.length <= maxLength ? tittle = product.productName : (tittle = product.productName.slice(0, maxLength) + '...');
    
    // Controlar si el producto esta en el arreglo de items para darle un estilo que resalte 
    let resaltar = null;
    function isProductSelected() {
        items.some((item) => item.product.id === product.id) ? resaltar = true : resaltar = false;
    }
    isProductSelected();

    // Agregar el producto al arreglo de items
    const handleClick = () => {
        // Controlar si el producto ya esta en el arreglo de items
        // Si es el caso se lo agrega y si ya esta se lo quita
        items.some((item) => item.product.id === product.id) ? removeItem(product) : addItem(product, 1);
    };

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
