import React from 'react'

// Importar el context Global
import { useGlobalContext } from "../context/ContextProvider";

//Importar el hook para direccionar al formulario de pedidos cuando se presione el boton editar
import { useNavigate } from "react-router-dom";

// Importo iconos de React Icons
import { MdDelete, MdFileDownloadDone } from 'react-icons/md';
import { AiFillEdit } from 'react-icons/ai';

// El componente recibe un elemento del arreglo de pedidos y muestra todas la info del mismo
export default function PedidoCard({ pedido }) {

    // Extraigo del context las funciones para eliminar un pedido y cambiarle el estado
    const {deletePedido, togglePedidoDone} = useGlobalContext();

    // Declaro constante para disponer del useNavigate
    const navigate = useNavigate();

    // Funcion para ver el estado del campo done
    const handleDone = async () => {
        // Imprimo por consola el valor del campo done del pedido para corroborar
        //console.log(taskDone);
        await togglePedidoDone(pedido.id);
    }

    return (
        <div className='Tarjeta relative'>
            <header className='flex justify-between mb-2'>
                <h2 className='text-xl font-bold'>{pedido.title}</h2>
                <span>{pedido.done == 1 ? "✅" : "❌"}</span>
            </header>
            <span className=''>{pedido.createAt}</span>

            <p className='mb-10 Tarjeta_field bg-white rounded-md h-40 overflow-y-auto whitespace-pre-wrap'>{pedido.description}</p>
            <div className='absolute bottom-3 flex flex-wrap gap-x-2 mt-3'>
                <button className='Card-icon' onClick={() => deletePedido(pedido.id)}><MdDelete/></button>
                <button className='Card-icon' onClick={() => navigate(`/editTarea/${pedido.id}`)}><AiFillEdit/></button>
                <button className='Card-icon' onClick={() => handleDone(pedido.done)}><MdFileDownloadDone/></button>
            </div>
        </div>
  )
}
