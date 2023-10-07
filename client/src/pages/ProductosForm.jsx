import React from 'react'
// Importar el componente de Formik para crear y manejar el formulario de alta de tareas
import { Form, Field, Formik, ErrorMessage } from "formik";
// Importa Yup para definir esquemas de validación
import * as Yup from 'yup';

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
import { MdDelete } from 'react-icons/md';

// Boton para volver a la paginma anterior
import GoBackButton from '../components/buttons/GoBackButton'

// Preview de la imagen de producto
import Preview_Image from '../components/Form Components/Preview_Image';

// Ruta de la imagen por defecto
import defaultImage from "../../assets/images/NoImage.jpg";

export default function ProductForm() {

  // Extraigo del context las funciones necesarias
  const {
    createProduct, // Fn de crear productos
    getProduct, // Fn para obtener un producto mediante el id
    updateProduct, // Fn para modificar un producto mediante su id y los nuevos valores
    deleteProduct // Fn para eliminar un producto mediante su id
  } = useGlobalContext();

  // Valores Iniciales
  const initialValues = {
    productName: "",
    description: "",
    price: 0,
  };

  // Definir el useState para setear valores en el formulario
  const [product, setProduct] = useState(initialValues);

  // Creo la constante para disponer del useParams
  const params = useParams();
  //console.log(params); // Muestro el id del producto en consola

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

        setProduct({
          productName: product.productName,
          imgURL: product.imgURL,
          description: product.description,
          price: product.price,
        });

        // Muestro por consola los datos del producto
        //console.log(product);

        // También establecemos el campo de imagen en null
        //setProduct({ ...product, imgURL: null });
      }
    };
    loadProduct();
  }, [])

  // Definir el esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    // Validacion para el campo nombre
    productName: Yup.string()
      .required('El nombre es obligatorio'),
    // Validacion para el campo precio
    price: Yup.number()
      .min(1, 'El precio debe ser mayor que cero')
      .required('El precio es obligatorio'),
  });

  // CONFIRMACION DE ELIMINACION
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  // Funcion para cambiar el estado de la variable que muestra el modal de confirmacion de eliminacion
  const handleDelete = () => {
      setShowDeleteConfirmation(true);
  }
  // CONFIRMAR: Se llama a la funcion que elimina el producto y se restablece showDeleteConfirmation a false
  const handleDeleteConfirm = async () => {
      // Llamar a la funcion que se encarga de eliminar el producto segun su id
      deleteProduct(params.id);
      // Restablece el estado de showDeleteConfirmation
      setShowDeleteConfirmation(false);

      // Redirigir a la página de productos
      navigate('/productos');
  };
  // CANCELAR: Se cambia a false el valor de showDelteConfirmation para ocultar el modal
  const handleDeleteCancel = () => {
      setShowDeleteConfirmation(false);
  };

  return (
    <div className='p-3 lg:p-6'>
      <GoBackButton/>
      <Formik
        // Defino los valores iniciales que tendran los campos
        // Si se quiere editar un producto se corresponderan con los
        // valores obtenidos de la db, sino estaran vacios al momento de crear uno nuevo
        initialValues={product}
        enableReinitialize={true}

        // Aplica el esquema de validación
        validationSchema={validationSchema}
        

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
          <Form onSubmit={handleSubmit} className='relative w-full lg:w-2/3 mx-auto bg-slate-300 rounded-md p-4'>

            <h1 className='mb-3 font-bold text-xl uppercase text-center'>{ params.id ? "Editar Producto" : "Nuevo Producto" }</h1>
            
            <div className="flex items-center">
              <label className='block mr-2'>Nombre:</label>
              <ErrorMessage name='productName' component='div' className='text-red-500 text-md'/>
            </div>
            <Field
                className='p-1 my-1 rounded-md w-full'
                type="text"
                name="productName"
                id="productName"
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
            {/* {product.imgURL && <img src={product.imgURL} alt="Preview"/>} */}
            <div className="flex justify-center items-center w-60 my-4 mx-auto h-60 bg-white">
            {(values.imgURL ? (
              <Preview_Image file={values.imgURL} url={values.imgURL} />
            ) : (
              <img src={defaultImage} alt="Default" />
            ))}
            </div>
            <div className="flex justify-center mb-2">
              <button
                type="button"
                onClick={() => {
                  setFieldValue('imgURL', null);
                  // También restablece el valor del campo de entrada de archivo
                  document.querySelector("input[type='file']").value = '';
                }}
                className="bg-details_3 text-white px-3 py-1 rounded-md"
              >
                Eliminar Imagen
              </button>
            </div>

            <label className='block'>Descripcion: </label>
            <Field
              component="textarea"
              className='p-1 my-1 mb-2 rounded-md w-full whitespace-pre-wrap'
              name="description"
              rows="3"
              placeholder='Escribe una descripcion para el producto'
            ></Field>

            <div className="flex items-center">
              <label className='block mr-2'>Precio:</label>
              <ErrorMessage name='price' component='div' className='text-red-500 text-md'/>
            </div>
            <Field
              className='p-1 my-1 mb-14 rounded-md w-full'
              type="number"
              name="price"
              placeholder='Escribe el precio'
            ></Field>
            
            <div className='absolute bottom-3 flex flex-wrap gap-x-2 mt-3'>
              <button className='bg-green-500 flex items-center justify-center h-9 w-20 rounded-md text-white' type='submit' disabled={isSubmitting}>
                {isSubmitting ? ( <AiOutlineLoading3Quarters className="animate-spin" /> ) : 'Guardar'}
              </button>
              {params.id && ( // Mostrar el boton de eliminar solo si se esta editando un producto, es decir, que existe un producto cuyo id se corresponda a params.id
                <button type='button' className='Card-icon pr-2' onClick={() => handleDelete()}><MdDelete className='m-1'/>Eliminar</button>
              )}
            </div>

            {showDeleteConfirmation && (
              <div>
                  <div className='backdrop-blur-md p-3 absolute inset-0 w-full h-full'></div>
                  <div className='Tarjeta flex flex-wrap w-10/12 p-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                      <p className='w-full text-center'>¿Estas seguro que deseas eliminar este producto?</p>
                      <div className='w-full flex justify-between mt-5'>
                          <button type='button' className = 'MainButton w-24 mt-2' onClick={handleDeleteConfirm}>Confirmar</button>
                          <button type='button' className = 'MainButton w-24 mt-2' onClick={handleDeleteCancel}>Cancelar</button>
                      </div>
                  </div>
              </div>
            )}
            
          </Form>
        )}
        
      </Formik>
    </div>
  )
}
