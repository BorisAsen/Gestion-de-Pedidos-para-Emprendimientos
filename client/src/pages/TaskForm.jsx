import React from 'react'
// Importar el componente de Formik para crear y manejar el formulario de alta de tareas
import { Form, Formik } from "formik";

// Importar el context de tareas
import { useGlobalContext } from "../context/ContextProvider";


// cuando se envia el id de una tarea para editarla


// Importar los hooks necesarios
// useEffect para obtener los datos de la tarea a editar al cargar la pagina
// useState para setear los campos del form con los datos de la tarea a modificar
// useParams para extraer los parametros dinamicos de la ruta
// useNavigate para redireccionar a la pagina principal con el listado de tareas una vez creada o modificada la tarea
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


export default function TaskForm() {

  // Extraigo del context las funciones necesarias
  const {
    createTask, // Fn de crear tareas
    getTask, // Fn para obtener una tarea mediante el id
    updateTask // Fn para modificar una tarea mediante su id y los nuevos valores
  } = useGlobalContext();

  // Definir el useState para setear valores en el formulario
  const [task, setTask] = useState({
    title: "",
    decription: "",
  });

  // Creo la constante para disponer del useParams
  const params = useParams();
  console.log(params); // Mustro el id de la tarea en consola

  // Creo la constante para disponer del useNavigate
  const navigate = useNavigate();

  // Utilizar el useEfect para traer los datos de la tarea en el caso de
  // que ya exista y se la quiera editar
  useEffect(() => {
    // Es necesario colocar el llamado a getTask con el await dentro de otra
    // funcion sino arroja un error
    const loadTask = async () => {
      if (params.id) {
        const task = await getTask(params.id);
        // Muestro por consola los datos de la tarea para corroborar
        // console.log(task);
        setTask({
          title: task.title,
          description: task.description,
        }) 
      }
    };
    loadTask();
  }, [])
  


  return (
    <div className='mt-3'>
      <Formik
        // Defino los valores iniciales que tendran los campos
        // Si se quiere editar una tarea se corresponderan con los
        // valores obtenidos de la db, sino estaran vacios al momento de crear una nueva
        initialValues={task}
        enableReinitialize={true}

        // Evento que se activa cuando el formuilario es enviado
        // Con esto se pueden observar por consola los datos que se capturaron
        onSubmit={async (values, actions) => {
          // Muestro los valores por consola
          console.log(values);
          // Corroboro si la tarea ya existe para modificarla o crearla segun corresponda
          if (params.id) {
            // Llamo a la funcion para modificar una tarea
            await updateTask(params.id, values)
          } else {
            // Llamo a la funcion para crear una tarea
            await createTask(values);
          }
          // Redireccionar a la pagina principal una vez actualizada o creada la tarea
          navigate("/");
          // Limpio el formulario una vez que se crea o modifica una tarea
          setTask({
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
            o actualizar una tarea. Si ya existe el id de la tarea el titulo sera Editar
            de caso contrario sera Crear. */}
            <h1 className='mb-3 font-bold text-xl uppercase text-center'>{ params.id ? "Editar Tarea" : "Crear Tarea" }</h1>
            <label className='block'>Title</label>
            <input
              className='p-1 my-2 rounded-md w-full'
              type="text"
              name="title"
              placeholder='Escribe un titulo'
              onChange={handleChange}
              value={values.title} // Resetea al valor inicial despues de enviar el form
            />

            <label className='block'>Description</label>
            <textarea
              className='p-1 my-2 rounded-md w-full'
              name="description"
              rows="3"
              placeholder='Escribe una descripcion de la tarea'
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
