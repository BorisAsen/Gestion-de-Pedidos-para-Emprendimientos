import React from 'react'
// Importar el componente de Formik para crear y manejar el formulario de alta de tareas
import { Form, Field, Formik, ErrorMessage } from "formik";
// Importa Yup para definir esquemas de validación
import * as Yup from 'yup';

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

// Importar el buscador de productos
import ProductoSearchBar from "../components/ProductoSearchBar"

// Boton para volver a la paginma anterior
import GoBackButton from '../components/buttons/GoBackButton'


export default function PedidosForm() {

  // Extraigo del context las funciones necesarias para pedidos
  const {
    createPedido, // Fn de crear pedidos
    getPedido, // Fn para obtener un pedido mediante el id
    updatePedido // Fn para modificar un pedido mediante su id y los nuevos valores
  } = useGlobalContext();

  // Extraigo del context el arreglo de items (Productos y sus cantidades) y la funcion para setearlo
  const { items, setItems, clearItems } = useGlobalContext();

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

  // Constante auxiliar que controla si el form es de modificacion o no
  const [isUpdateForm, setIsUpdateForm] = useState(false);


  // Utilizar el useEfect para traer los datos del pedido en el caso de que ya exista y se lo quiera editar
  useEffect(() => {

    // Es necesario colocar el llamado a getPedido con el await dentro de otra funcion sino arroja un error
    const loadPedido = async () => {
      if (params.id) {
        // Cambio el valor de isUpdateForm a true
        setIsUpdateForm(true);

        const pedido = await getPedido(params.id);
        // Muestro por consola los datos del pedido para corroborar
        //console.log(pedido);
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
        
        // Cargo el arreglo de items que se extrae del context para guardar los productos del pedido
        // con el arreglo de items que ya traia el pedido
        setItems(pedido.items);
      }
    };
    loadPedido();
    
  }, []);

  // Funcion para calcular el total del envio
  const calculateTotal = () => {
    let total = 0;

    items.forEach((item) => {
      total += item.product.price * item.quantity;
    });

    total += parseFloat(pedido.deliveryCost);

    return total;
  };

  // Definir el esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    // Validación para el arreglo de productos seleccionados
    // items: Yup.array()
    //   .min(1, 'Debe seleccionar al menos un producto'),

    // Validación para el campo fecha de entrega
    shippingDate: Yup.string()
      .required('La fecha de entrega es obligatoria'),

    // Validación para el campo direccion
    address: Yup.string()
      .required('La dirección es obligatoria'),

    // Validación para el campo cliente
    client: Yup.string()
      .required('El cliente es obligatorio'),

    // Validación para el campo precio
    total: Yup.number()
      .min(1, 'El total debe ser mayor que cero')
      .required('El total es obligatorio'),
  });


  return (
    <div className='p-6'>
      <GoBackButton/>
      <Formik
        // Defino los valores iniciales que tendran los campos
        // Si se quiere editar un pedido se corresponderan con los
        // valores obtenidos de la db, sino estaran vacios al momento de crear uno nuevo
        initialValues={pedido}
        enableReinitialize={true}

        // Aplica el esquema de validación
        validationSchema={validationSchema}

        // Evento que se activa cuando el formuilario es enviado
        onSubmit={async (values, actions) => {
          // Agregar el arreglo de items a los valores que capturo formik
          const updatedValues = { ...values, items: items };
          updatedValues.title = `${items.map(item => `${item.product.productName} (${item.quantity})`).join(' + ')}`;
          //updatedValues.total = calculateTotal() + values.deliveryCost;

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

          // Limpiar el arreglo de items una vez que se envia el formulario
          clearItems();
          
          // Redireccionar a la pagina anterior una vez actualizado o creado el pedido
          navigate(-1);
        }}
      >

        {/* Esta funcion permite que los datos capturados por los inputs se correspondan
        y guarden en los Values definidos anteriormente mediante la propiedad handleChange
        que se ejecuta con el evento onChange. Con la propiedad handleSubmit y el evento onSubmit
        se podran observar los datos capturados por el formulario */}
        {({ values, isSubmitting, handleSubmit }) => (
          <Form onSubmit={handleSubmit} className='w-full lg:w-2/3 mx-auto bg-slate-300 rounded-md p-4'>
           
            {/* Crear un titulo condicional para el formulario segun se quiera crear
            o actualizar un pedido. Si ya existe el id del pedido el titulo sera Editar,
            de caso contrario sera Crear. */}
            <h1 className='mb-3 font-bold text-xl uppercase text-center'>{ params.id ? "Editar Pedido" : "Crear Pedido" }</h1>
            
            <label className='block font-bold'>Titulo:</label>
            <Field
              className='p-1 mt-0.5 mb-2 rounded-md w-full'
              component="textarea"
              name="title"
              //placeholder='Escribe un titulo'
              disabled={true} 
              // Autocompletar el titulo del pedido con todos los items seleccionados y sus cantidades
              value={`${items.map(item => `${item.product.productName} (${item.quantity})`).join(' + ')}`}
            ></Field>

            {/* Barra de busqueda de productos */}
            <ProductoSearchBar/>
            <div className={`text-red-500 text-md ${items.length === 0 ? 'visible' : 'invisible'}`}>
              Debe seleccionar al menos un producto
            </div>

            <label className='block my-2 mb-3 w-24'>
              Entregado
              <Field
                className='ml-1.5'
                type="checkbox"
                name="done"
              ></Field>
            </label>

            <div className="flex items-center">
              <label className='block my-2 mb-3 mr-2'>Fecha de entrega: </label>
              <Field
              className='p-0.5 pl-1 w-44 ml-2 mr-3 rounded-md'
              type="datetime-local"
              name="shippingDate"
            ></Field>
              <ErrorMessage name='shippingDate' component='div' className='text-red-500 text-md'/>
            </div>
            
            

            <label className='block'>Despacho del pedido: </label>
            <Field
              as="select"
              name="withdrawOrSend"
              className='p-1 mt-0.5 mb-2 rounded-md w-full'
            >
              <option value={0}>Retira</option>
              <option value={1}>Envio</option>
            </Field>

            <div className="flex items-center">
              <label className='block mr-2'>Dirección:</label>
              <ErrorMessage name='address' component='div' className='text-red-500 text-md'/>
            </div>
            <Field
              component="textarea"
              className='p-1 mt-0.5 mb-2 rounded-md w-full'
              name="address"
              rows="3"
              placeholder='Escribe la dirección del envío'
            ></Field>

            <div className="flex items-center">
              <label className='block mr-2'>Cliente:</label>
              <ErrorMessage name='client' component='div' className='text-red-500 text-md'/>
            </div>
            <Field
              component="textarea"
              className='p-1 mt-0.5 mb-2 rounded-md w-full'
              name="client"
              rows="2"
              placeholder='Escribe el cliente que recibira el pedido'
            ></Field>

            <label className='block'>Costo del envío:</label>
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

            <label className='block'>Descripcion:</label>
            <Field
              component="textarea"
              className='p-1 mt-0.5 mb-2 rounded-md w-full'
              name="description"
              rows="5"
              placeholder='Escribe la descripcion del pedido'
            ></Field>

            <div className="flex items-center">
              <label className='block mr-2'>
                Total: <span className='text-details_2'>(Valor sugerido ${isUpdateForm ? calculateTotal() + values.deliveryCost - pedido.deliveryCost : calculateTotal() + values.deliveryCost})</span>
              </label>
              <ErrorMessage name='total' component='div' className='text-red-500 text-md'/>
            </div>
            <Field
              className='p-1 mt-0.5 mb-2 rounded-md w-full'
              type="number"
              name="total"
              placeholder= 'Escribe el total del pedido'
            ></Field>

            <button className='block bg-green-500 rounded-md px-2 py-0.5 text-white' type='submit' disabled={isSubmitting || items.length === 0}>
              {isSubmitting ? ( <AiOutlineLoading3Quarters className="animate-spin" /> ) : 'Guardar'}
            </button>
          </Form>
        )}
        
      </Formik>
    </div>
  )
}
