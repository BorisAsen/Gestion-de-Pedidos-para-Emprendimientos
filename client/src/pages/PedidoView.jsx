import React from 'react'

// Importar el context global
import { useGlobalContext } from "../context/ContextProvider";

// Importar los hooks necesarios
// useEffect para obtener los datos del pedido al cargar la pagina
// useState para setear los campos del form con los datos del pedido
// useParams para extraer los parametros dinamicos de la ruta
// useNavigate para redireccionar a la pagina anterior
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Importo iconos de React Icons
import { MdDelete, MdDone } from 'react-icons/md';
import { AiFillEdit } from 'react-icons/ai';

// Importar libreria moment para formatear fechas
import moment from 'moment';


export default function PedidosView() {
  // Creo la constante para disponer del useParams
  const params = useParams();
  //console.log('ID rescatado: ',params); // Mustro el id del pedido en consola

  // Extraigo del context las funciones necesarias
  const {
    getPedido, // Funcion para obtener un pedido mediante el id
    deletePedido, // Funcion para eliminar un pedido 
    togglePedidoDone // Funcion para cambiar el estado de un pedido 
  } = useGlobalContext();

  // Definir el useState para setear valores obtenidos de la db en los campos del pedido
  const [pedido, setPedido] = useState({});
  const [done, setDone] = useState(pedido.done);

  // Creo la constante para disponer del useNavigate
  const navigate = useNavigate();

  // Utilizar el useEfect para traer los datos del pedido
  useEffect(() => {
    // Es necesario colocar el llamado a getPedido con el await dentro de otra funcion sino arroja un error
    const loadPedido = async () => {
      if (params.id) {
        const pedido = await getPedido(params.id);
        // Muestro por consola los datos del pedido para corroborar
        // console.log(pedido);
        setPedido({
          id: pedido.id,
          title: pedido.title,
          description: pedido.description,
          done: pedido.done,
          shippingDate: pedido.shippingDate,
          createAt: pedido.createAt,
          updatedAt: pedido.updatedAt,
          doneAt: pedido.doneAt,
          withdrawOrSend: pedido.withdrawOrSend,
          address: pedido.address,
          client: pedido.client,
          deliveryCost: pedido.deliveryCost,
          total: pedido.total,
          payment: pedido.payment,
        });
        // Seteo el valor de done con el done de pedido
        setDone(pedido.done);
      }
    };
    loadPedido();
  }, [])

  

  // Funcion para cambiar el estado del campo done
  const handleDone = async () => {
    await togglePedidoDone(pedido.id);
    // Cambio el valor de done para que se renderize nuevamente el tilde o cruz
    setDone(!done);
  }
  
  //Formateo de Fechas
  const formattedShippingDate = moment(pedido.shippingDate).format('DD/MM/YY - HH:mm');
  const formattedCreateAt = moment(pedido.createAt).format('DD/MM/YY - HH:mm');
  const formattedUpdatedAt = moment(pedido.updatedAt).format('DD/MM/YY - HH:mm');
  let formattedDoneAt;
  pedido.doneAt ? formattedDoneAt = moment(pedido.doneAt).format('DD/MM/YY - HH:mm') : formattedDoneAt = "No entregado";
  





  return (
    <div className='p-5 flex justify-center'>
      <div className='Tarjeta relative w-5/6 mx-auto'>
            <header className='flex justify-between mb-2'>
                <h2 className='text-xl font-bold'>{pedido.title}</h2>
                <span>{done == 1 ? "✅" : "❌"}</span>
            </header>
            <p className='Tarjeta_field'><b>Entregado:</b> {done ? "SI" : "NO"}</p>
            <p className='Tarjeta_field'><b>Fecha de entrega:</b> {formattedShippingDate}</p>
            <p className='Tarjeta_field'><b>Envío o Retira:</b> {pedido.withdrawOrSend == 1 ? "Envio" : "Retira"}</p>
            <p className='Tarjeta_field h-20 Tarjeta_field_Overflow'><b>Dirección:</b> {pedido.address}</p>
            <p className='Tarjeta_field h-14 Tarjeta_field_Overflow'><b>Cliente:</b> {pedido.client}</p>
            <p className='Tarjeta_field'><b>Costo de envío:</b> {pedido.deliveryCost}</p>
            <p className='Tarjeta_field'><b>Metodo de pago:</b> {pedido.payment}</p>
            <p className='Tarjeta_field h-32 Tarjeta_field_Overflow'><b>Observaciones:</b> {pedido.description}</p>
            <p className='Tarjeta_field'><b>Total:</b> {pedido.total}</p>

            <p className='Tarjeta_field'><b>Creado el:</b> {formattedCreateAt}</p>
            <p className='Tarjeta_field'><b>Ultima modificación:</b> {formattedUpdatedAt}</p>
            <p className='Tarjeta_field mb-10'><b>Entregado el:</b> {formattedDoneAt}</p>

            <div className='absolute bottom-3 flex flex-wrap gap-x-2 mt-3'>
                <button className='Card-icon pr-2' onClick={() => (deletePedido(pedido.id), navigate(`/`))}><MdDelete className='m-1'/>Eliminar</button>
                <button className='Card-icon pr-2' onClick={() => navigate(`/editarPedido/${pedido.id}`)}><AiFillEdit className='m-1'/>Editar</button>
                <button className='Card-icon pr-2' onClick={() => handleDone(pedido.done)}><MdDone className='m-1'/>Entregado</button>
            </div>
        </div>
    </div>
  )
}
