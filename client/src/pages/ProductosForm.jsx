import React from 'react'
// Importar el componente de Formik para crear y manejar el formulario de alta de tareas
import { Form, Formik } from "formik";

// Importar el context de productos
 import { useGlobalContext } from "../context/ContextProvider";


// Importar los hooks necesarios
// useEffect para obtener los datos del producto a editar al cargar la pagina
// useState para setear los campos del form con los datos del producto a modificar
// useParams para extraer los parametros dinamicos de la ruta
// useNavigate para redireccionar a la pagina con el listado de prodcutos una vez cread0 o modificado el producto
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


export default function ProductForm() {

  // Extraigo del context las funciones necesarias
  const {
    createProduct, // Fn de crear productos
    getProduct, // Fn para obtener un producto mediante el id
    updateProduct // Fn para modificar un producto mediante su id y los nuevos valores
  } = useGlobalContext();

  // Definir el useState para setear valores en el formulario
  const [product, setProduct] = useState({
    productName: "",
    imgURL: "",
    description: "",
    price: 0,
  });

  // Creo la constante para disponer del useParams
  const params = useParams();
  console.log(params); // Mustro el id del producto en consola

  // Creo la constante para disponer del useNavigate
  const navigate = useNavigate();

  // Utilizar el useEfect para traer los datos del producto en el caso de
  // que ya exista y se lo quiera editar
  useEffect(() => {
    // Es necesario colocar el llamado a getProduct con el await dentro de otra
    // funcion sino arroja un error
    const loadProduct = async () => {
      if (params.id) {
        const product = await getProduct(params.id);
        // Muestro por consola los datos del producto para corroborar
        // console.log(product);
        setProduct({
          productName: product.productName,
          imgURL: product.imgURL,
          description: product.description,
          price: product.price,
        }) 
      }
    };
    loadProduct();
  }, [])
  


  return (
    <div className='mt-3'>
      <Formik
        // Defino los valores iniciales que tendran los campos
        // Si se quiere editar un producto se corresponderan con los
        // valores obtenidos de la db, sino estaran vacios al momento de crear uno nuevo
        initialValues={product}
        enableReinitialize={true}

        // Evento que se activa cuando el formuilario es enviado
        // Con esto se pueden observar por consola los datos que se capturaron
        onSubmit={async (values, actions) => {
          // Muestro los valores por consola
          console.log(values);
          // Corroboro si el producto ya existe para modificarlo o crearlo segun corresponda
          if (params.id) {
            // Llamo a la funcion para modificar un producto
            await updateProduct(params.id, values)
          } else {
            // Llamo a la funcion para crear un producto
            await createProduct(values);
          }
          // Redireccionar a la pagina de productos una vez actualizado o creado el producto
          navigate("/productos");
          // Limpio el formulario una vez que se crea o modifica un producto
          setProduct({
            productName: "",
            imgURL: "",
            description: "",
            price: 0,
          });
        }}
        >
        {/* Esta funcion permite que los datos capturados por los inputs se correspondan
        y guarden en los Values definidos anteriormente mediante la propiedad handleChange
        que se ejecuta con el evento onChange. Con la propiedad handleSubmit y el evento onSubmit
        se podran observar los datos capturados por el formulario */}
        {({handleChange, handleSubmit, values, isSubmitting}) => (
          <Form onSubmit={handleSubmit} encType='multipart/form-data' className='mx-auto bg-slate-300 max-w-sm rounded-md p-4'>
            {/* Crear un titulo condicional para el formulario segun se quiera crear
            o actualizar un producto. Si ya existe el id del producto el titulo sera Editar
            de caso contrario sera Crear. */}
            <h1 className='mb-3 font-bold text-xl uppercase text-center'>{ params.id ? "Editar Producto" : "Crear Producto" }</h1>
            <label className='block'>Nombre</label>
            <input
              className='p-1 my-2 rounded-md w-full'
              type="text"
              name="productName"
              placeholder='Escribe un nombre'
              onChange={handleChange}
              value={values.productName} // Resetea al valor inicial despues de enviar el form
            />

            <label className='block'>Imagen</label>
            <input
              className='p-1 my-2 rounded-md w-full'
              type="file"
              accept='.jpg, .jpeg, .png'
              name="imgURL"
              onChange={handleChange}
              value={values.imgURL} // Resetea al valor inicial despues de enviar el form
            />

            {/* {
              console.log(values.imgURL.split('fakepath\\')[1])
            } */}

            <label className='block'>Description</label>
            <textarea
              className='p-1 my-2 rounded-md w-full'
              name="description"
              rows="3"
              placeholder='Escribe una descripcion del producto'
              onChange={handleChange}
              value={values.description} // Resetea al valor inicial despues de enviar el form
            ></textarea>

            <label className='block'>Precio</label>
            <input
              className='p-1 my-2 rounded-md w-full'
              type="number"
              name="price"
              placeholder='Escribe el precio'
              onChange={handleChange}
              value={values.price} // Resetea al valor inicial despues de enviar el form
            />

            <button className='bg-green-500 rounded-md px-2 py-0.5 text-white' type='submit' disabled={isSubmitting}>
              {
                /* Desabilitar el boton de guardar mientras se almacena el prodcuto */
                isSubmitting ? "Guardando..." : "Guardar"
              }
            </button>
          </Form>
        )}
        
      </Formik>
    </div>
  )
}
