import React from 'react'
// Importar el componente de Formik para crear y manejar el formulario de alta de tareas
import { Form, Formik } from "formik";

// Importar el context global
import { useGlobalContext } from "../context/ContextProvider";

// Importar los hooks necesarios
// useEffect para obtener los datos del pedido a editar al cargar la pagina
// useState para setear los campos del form con los datos del pedido a modificar
// useParams para extraer los parametros dinamicos de la ruta
// useNavigate para redireccionar a la pagina principal con el listado de pedidos una vez creado o modificado el pedido
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


export default function PedidosForm() {

  // Extraigo del context las funciones necesarias
  const {
    createPedido, // Fn de crear pedidos
    getPedido, // Fn para obtener un pedido mediante el id
    updatePedido // Fn para modificar un pedido mediante su id y los nuevos valores
  } = useGlobalContext();

  // Definir el useState para setear valores en el formulario
  const [pedido, setPedido] = useState({
    title: "",
    decription: "",
  });

  // Creo la constante para disponer del useParams
  const params = useParams();
  console.log(params); // Mustro el id del pedido en consola

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
          title: pedido.title,
          description: pedido.description,
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
        // Con esto se pueden observar por consola los datos que se capturaron
        onSubmit={async (values, actions) => {
          // Muestro los valores por consola
          console.log(values);
          // Corroboro si el pedido ya existe para modificarlo o crearlo segun corresponda
          if (params.id) {
            // Llamo a la funcion para modificar un pedido
            await updatePedido(params.id, values)
          } else {
            // Llamo a la funcion para crear un pedido
            await createPedido(values);
          }
          // Redireccionar a la pagina principal una vez actualizado o creado el pedido
          navigate("/");
          // Limpio el formulario una vez que se crea o modifica un pedido
          setPedido({
            title: "",
            description: "",
          });
        }}
        >
        {/* Esta funcion permite que los datos capturados por los inputs se correspondan
        y guarden en los Values definidos anteriormente mediante la propiedad handleChange
        que se ejecuta con el evento onChange. Con la propiedad handleSubmit y el evento onSubmit
        se podran observar los datos capturados por el formulario */}
        {({handleChange, handleSubmit, values, isSubmitting}) => (
          <Form onSubmit={handleSubmit} className='mx-auto bg-slate-300 max-w-sm rounded-md p-4'>
            {/* Crear un titulo condicional para el formulario segun se quiera crear
            o actualizar un pedido. Si ya existe el id del pedido el titulo sera Editar,
            de caso contrario sera Crear. */}
            <h1 className='mb-3 font-bold text-xl uppercase text-center'>{ params.id ? "Editar Pedido" : "Crear Pedido" }</h1>
            <label className='block'>Titulo</label>
            <input
              className='p-1 my-2 rounded-md w-full'
              type="text"
              name="title"
              placeholder='Escribe un titulo'
              onChange={handleChange}
              value={values.title} // Resetea al valor inicial despues de enviar el form
            />

            <label className='block'>Descripcion</label>
            <textarea
              className='p-1 my-2 rounded-md w-full'
              name="description"
              rows="10"
              placeholder='Escribe la descripcion del pedido'
              onChange={handleChange}
              value={values.description} // Resetea al valor inicial despues de enviar el form
            ></textarea>

            <button className='bg-green-500 rounded-md px-2 py-0.5 text-white' type='submit' disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </Form>
        )}
        
      </Formik>
    </div>
  )
}
