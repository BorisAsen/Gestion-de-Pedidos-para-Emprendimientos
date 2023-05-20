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
export default function PedidoCard({ pedido }) {

    // Extraigo del context las funciones para eliminar un pedido y cambiarle el estado
    const {deletePedido, togglePedidoDone} = useGlobalContext();

    // Declaro constante para disponer del useNavigate
    const navigate = useNavigate();


    // CONFIRMACION DE ENTREGADO
    const [showDoneConfirmation, setShowDoneConfirmation] = useState(false);
    // Funcion para cambiar el estado de la variable que muestra el modal de confirmacion de entregado
    const handleDone = () => {
        setShowDoneConfirmation(true);
    }
    // CONFIRMAR: Se llama a la funcion que cambia el estado done del pedido y se restablece showDoneConfirmation a false
    const handleDoneConfirm = async () => {
        // Llamar a la funcion que se encarga de cambiar el estado de entregado segun el id del pedido
        await togglePedidoDone(pedido.id);
        // Restablece el estado de showDoneConfirmation
        setShowDoneConfirmation(false);
    };
    // CANCELAR: Se cambia a false el valor de showDoneConfirmation para ocultar el modal
    const handleDoneCancel = () => {
        setShowDoneConfirmation(false);
    };

    // CONFIRMACION DE ELIMINACION
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    // Funcion para cambiar el estado de la variable que muestra el modal de confirmacion de eliminacion
    const handleDelete = () => {
        setShowDeleteConfirmation(true);
    }
    // CONFIRMAR: Se llama a la funcion que elimina el pedido y se restablece showDeleteConfirmation a false
    const handleDeleteConfirm = async () => {
        // Llamar a la funcion que se encarga de eliminar el pedido segun su id
        deletePedido(pedido.id);
        // Restablece el estado de showDeleteConfirmation
        setShowDeleteConfirmation(false);
    };
    // CANCELAR: Se cambia a false el valor de showDelteConfirmation para ocultar el modal
    const handleDeleteCancel = () => {
        setShowDeleteConfirmation(false);
    };


    //Formateo de Fechas
    const formattedDate = moment(pedido.shippingDate).format('DD/MM/YY - HH:mm');

    // Funcion que renderiza los productos seleccionados para el pedido
    // {item.product.imgURL && <img className='w-100' src={item.product.imgURL}/>}
    // <SelectedProductView item={item} key={item.product.id}/>
    function renderSelectedProducts() {
        return pedido.items.map ((item) => 
            <div className='relative bg-details_3 h-max' key={item.product.id}>
                <img className='w-100' src={item.product.imgURL}/>
                <div className='Cantidad bg-details_2'>{item.quantity}</div>
            </div>
        )
    }

    return (
        <div className='Tarjeta relative'>
        {/* <div className={`Tarjeta relative z-0 ${showConfirmation ? 'blur-sm' : ''}`} > */}
            <header className='flex justify-between mb-2'>
                <h2 className='text-xl font-bold'>{pedido.title}</h2>
                <span>{pedido.done == 1 ? "✅" : "❌"}</span>
            </header>
            {/* <p className='Tarjeta_field'>id Pedido: {pedido.id}</p> */}
            <div className='grid grid-cols-4 gap-2 overflow-auto h-max pb-1 mb-2'>
                {renderSelectedProducts()}
            </div>
            {/* <p className='Tarjeta_field h-40 Tarjeta_field_Overflow'><b>Descripción:</b> {pedido.description}</p> */}
            <p className='Tarjeta_field'><b>Fecha de entrega:</b> {formattedDate}</p>
            {/* <p className='Tarjeta_field'><b>Creado el:</b> {pedido.createAt}</p> */}
            {/* <p className='Tarjeta_field'><b>Ultima modificación:</b> {pedido.updatedAt}</p> */}
            {/* <p className='Tarjeta_field'><b>Entregado el:</b> {pedido.doneAt}</p> */}
            <p className='Tarjeta_field'><b>Envío o Retira:</b> {pedido.withdrawOrSend == 1 ? "Envio" : "Retira"}</p>
            <p className='Tarjeta_field h-20 Tarjeta_field_Overflow'><b>Dirección:</b> {pedido.address}</p>
            {/* <p className='Tarjeta_field h-20 Tarjeta_field_Overflow'><b>Cliente:</b> {pedido.client}</p> */}
            {/* <p className='Tarjeta_field'><b>Costo de envío:</b> {pedido.deliveryCost}</p> */}
            <p className='Tarjeta_field mb-10'><b>Total:</b> {pedido.total}</p>
            {/* <p className='Tarjeta_field mb-10'><b>Medio de pago:</b> {pedido.payment}</p> */}

            <div className='absolute bottom-3 flex flex-wrap gap-x-2 mt-3'>
                <button className='Card-icon' onClick={() => handleDelete()}><MdDelete/></button>
                <button className='Card-icon' onClick={() => navigate(`/editarPedido/${pedido.id}`)}><AiFillEdit/></button>
                <button className='Card-icon' onClick={() => handleDone()}><MdDone/></button>
                <button className='Card-icon' onClick={() => navigate(`/vistaPedido/${pedido.id}`)}><AiFillEye/></button>
            </div>

            {showDeleteConfirmation && (
            <div>
                <div className='backdrop-blur-md p-3 absolute inset-0 w-full h-full'></div>
                <div className='Tarjeta flex flex-wrap w-4/6 p-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                    <p className='w-full text-center'>¿Estas seguro que deseas eliminar este pedido?</p>
                    <div className='w-full grid grid-cols-2 gap-1'>
                        <button type='buton' className = 'MainButton mt-2' onClick={handleDeleteConfirm}>Confirmar</button>
                        <button type='buton' className = 'MainButton mt-2' onClick={handleDeleteCancel}>Cancelar</button>
                    </div>
                </div>
            </div>
            )}
            

            {showDoneConfirmation && (
            <div>
                <div className='backdrop-blur-md p-3 absolute inset-0 w-full h-full'></div>
                <div className='Tarjeta flex flex-wrap w-4/6 p-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                    <p className='w-full text-center'>Al marcar un pedido como {pedido.done ? '"NO ENTREGADO"' : '"ENTREGADO"'}  se lo pasará al listado de {pedido.done ? 'PEDIDOS' : 'VENTAS'}</p>
                    <div className='w-full grid grid-cols-2 gap-1'>
                        <button type='buton' className = 'MainButton mt-2' onClick={handleDoneConfirm}>Confirmar</button>
                        <button type='buton' className = 'MainButton mt-2' onClick={handleDoneCancel}>Cancelar</button>
                    </div>
                </div>
            </div>
            )}
        </div>
  )
}
