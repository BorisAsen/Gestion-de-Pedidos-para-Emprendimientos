import React from 'react'
// Importar el componente de Formik para crear y manejar el formulario de alta de tareas
import { Form, Field, Formik } from "formik";

// Importar el context global
import { useGlobalContext } from "../context/ContextProvider";

// Importar los hooks necesarios
// useEffect para obtener los datos del pedido a editar al cargar la pagina
// useState para setear los campos del form con los datos del pedido a modificar
// useParams para extraer los parametros dinamicos de la ruta
// useNavigate para redireccionar a la pagina principal con el listado de pedidos una vez creado o modificado el pedido
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Importar iconos
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

// Importar libreria moment para formatear fechas
import moment from 'moment';

import ProductoSearchBar from "../components/ProductoSearchBar"


export default function PedidosForm() {

  // Extraigo del context las funciones necesarias para pedidos
  const {
    createPedido, // Fn de crear pedidos
    getPedido, // Fn para obtener un pedido mediante el id
    updatePedido // Fn para modificar un pedido mediante su id y los nuevos valores
  } = useGlobalContext();

  // Extraigo del context el arreglo de items (Productos y sus cantidades) y la funcion para setearlo
  const { items } = useGlobalContext();

  // Definir el useState para setear valores en el formulario
  const [pedido, setPedido] = useState({
    title: "",
    description: "",
    done: false,
    shippingDate: moment().format('YYYY-MM-DDTHH:mm'),
    //createAt: "",
    //updatedAt: "",
    //doneAt: "",
    withdrawOrSend: 1,
    address: "",
    client: "",
    deliveryCost: 0,
    total: 0,
    payment: "Efectivo"
  });

  // Creo la constante para disponer del useParams
  const params = useParams();
  //console.log(params); // Mustro el id del pedido en consola

  // Creo la constante para disponer del useNavigate
  const navigate = useNavigate();

  // Utilizar el useEfect para traer los datos del pedido en el caso de que ya exista y se lo quiera editar
  useEffect(() => {
    // Es necesario colocar el llamado a getPedido con el await dentro de otra funcion sino arroja un error
    const loadPedido = async () => {
      if (params.id) {
        const pedido = await getPedido(params.id);
        // Muestro por consola los datos del pedido para corroborar
        // console.log(pedido);
        setPedido({
          //id: pedido.id,
          title: pedido.title,
          description: pedido.description,
          // La conversion a true y false es necesaria ya que el 0 o 1 que viene de la db
          // setean de manera incorrecta el checkbox, el cual los transforma en texto al
          // tomar su valor cuando se interactua con el. De esta manera cuando se envia el
          // formulario, en lugar de enviar un valor booleano envia el 0 o 1 en forma de
          // texto lo cual provoca un error. Otro problema que desencadena esta conversion
          // de numeros a texto es que al cambiar el valor del check este se traba con el 
          // valor 1 y deja de responder al cambio
          done: (pedido.done ? true : false),
          // Transformo el formato de fecha a datetime-local ya que sino da error ya que el
          // formato de fecha del datetime de la db es distinto al que brinda el input
          shippingDate: moment(pedido.shippingDate).format('YYYY-MM-DDTHH:mm'), 
          //createAt: pedido.createAt,
          //updatedAt: pedido.updatedAt,
          //doneAt: pedido.doneAt,
          withdrawOrSend: pedido.withdrawOrSend,
          address: pedido.address,
          client: pedido.client,
          deliveryCost: pedido.deliveryCost,
          total: pedido.total,
          payment: pedido.payment,
        }) 
      }
    };
    loadPedido();
    
  }, [])

  
  return (
    <div className='p-6'>
      <Formik
        // Defino los valores iniciales que tendran los campos
        // Si se quiere editar un pedido se corresponderan con los
        // valores obtenidos de la db, sino estaran vacios al momento de crear uno nuevo
        initialValues={pedido}
        enableReinitialize={true}

        // Evento que se activa cuando el formuilario es enviado
        onSubmit={async (values, actions) => {
          // Agregar el arreglo de items a los valores que capturo formik
          const updatedValues = { ...values, items: items };

          // Muestro los valores capturados por consola
          //console.log("VALORES ENVIADOS: ", values);
          // Corroboro si el pedido ya existe para modificarlo o crearlo segun corresponda
          if (params.id) {
            // Llamo a la funcion para modificar un pedido
            await updatePedido(params.id, updatedValues)
          } else {
            // Llamo a la funcion para crear un pedido
            await createPedido(updatedValues);
          }
          
          // Limpio el formulario una vez que se crea o modifica un pedido
          // setPedido({
          //   title: "",
          //   description: "",
          //   done: 0,
          //   shippingDate: "",
          //   createAt: "",
          //   updatedAt: "",
          //   doneAt: "",
          //   withdrawOrSend: 1,
          //   address: "",
          //   client: "",
          //   deliveryCost: 0,
          //   total: 0,
          //   payment: ""
          // });

          actions.setSubmitting(false);
          // Redireccionar a la pagina principal una vez actualizado o creado el pedido
          navigate("/");
        }}
      >

        {/* Esta funcion permite que los datos capturados por los inputs se correspondan
        y guarden en los Values definidos anteriormente mediante la propiedad handleChange
        que se ejecuta con el evento onChange. Con la propiedad handleSubmit y el evento onSubmit
        se podran observar los datos capturados por el formulario */}
        {({ isSubmitting, handleSubmit }) => (
          <Form onSubmit={handleSubmit} className='w-5/6 mx-auto bg-slate-300 rounded-md p-4'>
           
            {/* Crear un titulo condicional para el formulario segun se quiera crear
            o actualizar un pedido. Si ya existe el id del pedido el titulo sera Editar,
            de caso contrario sera Crear. */}
            <h1 className='mb-3 font-bold text-xl uppercase text-center'>{ params.id ? "Editar Pedido" : "Crear Pedido" }</h1>
            
            <label className='block'>Titulo:</label>
            <Field
              className='p-1 mt-0.5 mb-2 rounded-md w-full'
              type="text"
              name="title"
              placeholder='Escribe un titulo'
              //value={values.title} // Resetea al valor inicial despues de enviar el form
            ></Field>

            {/* Barra de busqueda de productos */}
            <ProductoSearchBar/>

            <label className='block my-2 mb-3 w-full'>
              Entregado
              <Field
                className='ml-1.5'
                type="checkbox"
                name="done"
              ></Field>
            </label>

            <label className='block my-2 mb-3'>
              Fecha de entrega 
              <Field
                className='p-0.5 ml-2 rounded-md'
                type="datetime-local"
                name="shippingDate"
              ></Field>
            </label>

            <label className='block'>Despacho del pedido: </label>
            <Field
              as="select"
              name="withdrawOrSend"
              className='p-1 mt-0.5 mb-2 rounded-md w-full'
            >
              <option value={0}>Retira</option>
              <option value={1}>Envio</option>
            </Field>

            
            <label className='block'>Dirección:</label>
            <Field
              component="textarea"
              className='p-1 mt-0.5 mb-2 rounded-md w-full'
              name="address"
              rows="3"
              placeholder='Escribe la dirección del envío'
            ></Field>

            <label className='block'>Cliente:</label>
            <Field
              component="textarea"
              className='p-1 mt-0.5 mb-2 rounded-md w-full'
              name="client"
              rows="2"
              placeholder='Escribe el cliente que recibira el pedido'
            ></Field>

            <label className='block'>Costo del envío: </label>
            <Field
              className='p-1 mt-0.5 mb-2 rounded-md w-full'
              type="number"
              name="deliveryCost"
              placeholder='Escribe el precio el envio'
            ></Field>

            <div className='block my-2 w-full'>
              <label className=''>
              Efectivo
                <Field
                  className='m-1.5'
                  type="radio"
                  value="Efectivo"
                  name="payment"
                ></Field>
              </label>

              <label className='ml-3'>
              Transferencia
                <Field
                  className='m-1.5'
                  type="radio"
                  value="Transferencia"
                  name="payment"
                ></Field>
              </label>

              <label className='ml-3'>
              Tarjeta
                <Field
                  className='m-1.5'
                  type="radio"
                  value="Tarjeta"
                  name="payment"
                ></Field>
              </label>
            </div>

            <label className='block'>Observaciones:</label>
            <Field
              component="textarea"
              className='p-1 mt-0.5 mb-2 rounded-md w-full'
              name="description"
              rows="5"
              placeholder='Escribe la descripcion del pedido'
            ></Field>

            <label className='block'>Total: </label>
            <Field
              className='p-1 mt-0.5 mb-2 rounded-md w-full'
              type="number"
              name="total"
              placeholder='Escribe el total del pedido'
            ></Field>

            <button className='block bg-green-500 rounded-md px-2 py-0.5 text-white' type='submit' disabled={isSubmitting}>
              {isSubmitting ? ( <AiOutlineLoading3Quarters className="animate-spin" /> ) : 'Guardar'}
            </button>
          </Form>
        )}
        
      </Formik>
    </div>
  )
}
