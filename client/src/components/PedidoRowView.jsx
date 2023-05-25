import React from 'react'

// Importar el context Global
import { useGlobalContext } from "../context/ContextProvider";

import { useState } from "react";

//Importar el hook para direccionar al formulario de pedidos cuando se presione el boton editar
import { useNavigate } from "react-router-dom";

// Importar iconos de React Icons
import { MdDelete, MdDone } from 'react-icons/md';
import { AiFillEdit, AiFillEye } from 'react-icons/ai';

// Importar libreria moment para formatear fechas
import moment from 'moment';

// El componente recibe un elemento del arreglo de pedidos y muestra todas la info del mismo
export default function PedidoRowView({ pedido }) {

    // Declaro constante para disponer del useNavigate
    const navigate = useNavigate();

    //Formateo de Fechas
    const formattedDate = moment(pedido.shippingDate).format('DD/MM/YY - HH:mm');

    // Funcion que renderiza los productos seleccionados para el pedido
    // {item.product.imgURL && <img className='w-100' src={item.product.imgURL}/>}
    // <SelectedProductView item={item} key={item.product.id}/>
    function renderSelectedProducts() {
        return pedido.items.map ((item) => 
            <div className='relative bg-details_3 h-max' key={item.product.id}>
                <img className='96' src={item.product.imgURL}/>
                <div className='Cantidad bg-details_2'>{item.quantity}</div>
            </div>
        )
    }

    return (
        <div className='mb-1 grid grid-cols-11 gap-1'>
            <span title={pedido.title} className='PedidoRowViewField col-span-3 truncate inline-block rounded-bl-md rounded-tl-md'>{pedido.title}</span>
            <span title={formattedDate} className='PedidoRowViewField col-span-2 truncate inline-block'>{formattedDate}</span>
            <span title={pedido.client} className='PedidoRowViewField col-span-2 truncate inline-block'>{pedido.client}</span>
            <span title={pedido.address} className='PedidoRowViewField col-span-2 truncate inline-block'>{pedido.address}</span>
            <span className='PedidoRowViewField col-span-1 truncate inline-block'>{pedido.total}</span>
            <div className='PedidoRowViewField col-span-1 truncate rounded-br-md rounded-tr-md'><button className='Card-icon' onClick={() => navigate(`/vistaPedido/${pedido.id}`)}><AiFillEye/></button></div>
        </div>
  )
}
