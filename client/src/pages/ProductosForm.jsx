import React from 'react'
// Importar el componente de Formik para crear y manejar el formulario de alta de tareas
import { Form, Field, Formik } from "formik";

// Importar el context de productos
 import { useGlobalContext } from "../context/ContextProvider";

// Importar los hooks necesarios
// useEffect para obtener los datos del producto a editar al cargar la pagina
// useState para setear los campos del form con los datos del producto a modificar
// useParams para extraer los parametros dinamicos de la ruta
// useNavigate para redireccionar a la pagina con el listado de prodcutos una vez cread0 o modificado el producto
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Importar iconos
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

import Preview_Image from '../components/Form Components/Preview_Image';

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
    imgURL: null,
    description: "",
    price: 0,
  });

  // Creo la constante para disponer del useParams
  const params = useParams();
  //console.log(params); // Muestro el id del producto en consola

  // Creo la constante para disponer del useNavigate
  const navigate = useNavigate();

  const [originalImage, setOriginalImage] = useState({imgURL: null});

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
        setOriginalImage({
          imgURL: product.imgURL,
        })
        setProduct({
          productName: product.productName,
          //imgURL: product.imgURL,
          description: product.description,
          price: product.price,
        })
      }
    };
    loadProduct();
  }, [])

  return (
    <div className='p-6'>
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
          console.log('Valores tomados del form: ', values);
          // Corroboro si el producto ya existe para modificarlo o crearlo segun corresponda
          if (params.id) {
            // Llamo a la funcion para modificar un producto
            await updateProduct(params.id, values)
          } else {
            // Llamo a la funcion para crear un producto
            await createProduct(values);
            //await uploadFile();
          }
          
          // Limpio el formulario una vez que se crea o modifica un producto
          setProduct({
            productName: "",
            imgURL: null,
            description: "",
            price: 0,
          });
          
          actions.setSubmitting(false);
          navigate("/productos");
        }}
      >

        {({ values, setFieldValue, isSubmitting, handleSubmit }) => (
          <Form onSubmit={handleSubmit} className='mx-auto bg-slate-300 max-w-sm rounded-md p-4'>

            <h1 className='mb-3 font-bold text-xl uppercase text-center'>{ params.id ? "Editar Producto" : "Nuevo Producto" }</h1>
            
            <label className='block'>Nombre: </label>
            <Field
              className='p-1 my-1 mb-2 rounded-md w-full'
              type="text"
              name="productName"
              placeholder='Escribe un nombre'
            ></Field>

            <label className='block'>Imagen: </label>
            <input
              className='p-1 my-1 mb-2 rounded-md w-full'
              type="file"
              name="imgURL"
              accept='.jpg, .jpeg, .png'
              onChange={(e) => setFieldValue('imgURL', e.target.files[0])}
            />

            {/* Preview de la imagen */}
            {product.imgURL && <img src={product.imgURL}/>}
            <div className="flex justify-center items-center w-60 my-4 mx-auto h-60 bg-white">
              {(values.imgURL) && ( <Preview_Image file={values.imgURL}/> )}
              {/* En el caso de que se este editando el producto, se debe cargar la imagen original en el preview */}
              {(!values.imgURL && originalImage.imgURL) && ( 
                  <div>
                    {originalImage.imgURL && <img src={originalImage.imgURL}/>}
                  </div>
              )}
            </div>  

            <label className='block'>Descripcion: </label>
            <Field
              component="textarea"
              className='p-1 my-1 mb-2 rounded-md w-full whitespace-pre-wrap'
              name="description"
              rows="3"
              placeholder='Escribe una descripcion para el producto'
            ></Field>

            <label className='block'>Precio: </label>
            <Field
              className='p-1 my-1 mb-2 rounded-md w-full'
              type="number"
              name="price"
              placeholder='Escribe el precio'
            ></Field>

            <button className='bg-green-500 flex items-center justify-center h-9 w-20 rounded-md text-white' type='submit' disabled={isSubmitting}>
              {isSubmitting ? ( <AiOutlineLoading3Quarters className="animate-spin" /> ) : 'Guardar'}
            </button>
          </Form>
        )}
        
      </Formik>
    </div>
  )
}
