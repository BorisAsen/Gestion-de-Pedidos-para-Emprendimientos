import React from 'react'

// Importar el context de items
import { useGlobalContext } from "../context/ContextProvider";

// Importo iconos de React Icons
import { AiOutlineClose } from 'react-icons/ai';
import { IoMdAdd  } from 'react-icons/io';
import { BiMinus  } from 'react-icons/bi';


// El componente recibe un elemento del arreglo de items
export default function ProductShortView({ item }) {
    // Extraigo del context el arreglo de items que
    // contiene los productos seleccionados para el pedido y sus cantidades
    const {items, removeItem, modifyQuantity} = useGlobalContext();

    // Controlar si el producto esta en el arreglo de items para darle un estilo que resalte 
    let resaltar = false;
    function isProductSelected() {
        items.some((item) => item.product === item.product) ? resaltar = true : resaltar = false;
    }
    isProductSelected();



    return (
        <div className={`SelectedProductView ${resaltar ? 'border-2 border-details_3' : null}`}>
            <header className='flex justify-between text-white'>
                <button type="button" onClick={() => modifyQuantity(item, item.quantity-1)} className='QuantityButtons rounded-tl'><BiMinus/></button>
                <div className='text-black bg-white w-full flex items-center justify-center font-bold'>{item.quantity}</div>
                <button type="button" onClick={() => modifyQuantity(item, item.quantity+1)} className='QuantityButtons rounded-tr'><IoMdAdd/></button>
            </header>
            {item.product.imgURL && <img className='w-100' src={item.product.imgURL}/>}
            
            {/* <div className='Cantidad'>{item.quantity}</div> */}
            {/* <SelectedProductModal item={item} isOpen={modalOpen} onClose={handleCloseModal}/> */}
            <button className='Cantidad' onClick={() => removeItem(item.product)}><AiOutlineClose/></button>
        </div>
  )
}
