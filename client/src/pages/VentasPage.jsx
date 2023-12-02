import React from 'react'

// Importar el hook useEffect para mostrar informacion ni bien se carga la pagina
import { useEffect, useState } from "react";

// Importar el componente para mostrar una tarjeta de pedido
import PedidoShortView from "../components/PedidoShortView";

// Importo el context global
import { useGlobalContext } from "../context/ContextProvider";

// Importo el Link para redirigir a los formularios de pedidos
import { Link } from "react-router-dom";

// Importar el Paginador
import Paginador from "../components/pagination/Paginador"

// Importar el componente para mostrar el loading skeleton de pedido
import LoadingSkOrderShortView from '../loadingSkeletons/LoadingSkOrderShortView';

export default function VentasPage() {
  // Extraigo del context el arreglo de pedidos vacio y la funcion para cargarlo con los pedidos de la db
  const {pedidos, loadPedidos} = useGlobalContext();

  // Estado para el valor del filtro de ventas
  const [selectedFilter_Ventas, setSelectedFilter_Ventas] = useState("today");

  // Estado para controlar la carga de los pedidos
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Se ejecuta al cargar la pagina
  useEffect (() => {
    // Carga el arreglo de ventas
    // Envio el 1 como parametro para indicar que se deben traer de la db los pedidos SI entregados
    loadPedidos(1);

    // Recuperar el valor almacenado en localStorage (si existe)
    const storedValue = localStorage.getItem('selectedFilter_Ventas');
    if (storedValue) {
      setSelectedFilter_Ventas(storedValue);
    }

    // Simular un retraso de 200 milisegundos para la animacion de carga de pedidos
    const delay = setTimeout(() => {
      setLoadingOrders(false); // Marca la carga como finalizada
    }, 200);
  }, [pedidos]);

  // Filtrar las ventas por hoy, mañana, semana y mes
  const ventasFilter = pedidos.filter((pedido) => {
    // Al ya traer de la db el listado de ventas mensual, solo se debe controlar
    // cuando se seleccione hoy o semana para modificar el arreglo
    const pedidoDate = new Date(pedido.shippingDate);
    switch (selectedFilter_Ventas) {
      case "today":
      const today = new Date().setHours(0, 0, 0, 0); // Fecha de hoy a las 00:00
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1); // Fecha de mañana a las 00:00
      return pedidoDate >= today && pedidoDate < tomorrow;
        
      case "week": // Se cuenta de lunes a domingo
        const currentDate = new Date();
        const currentWeekStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 1);
        const currentWeekEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (8 - currentDate.getDay()));
        return pedidoDate >= currentWeekStart && pedidoDate <= currentWeekEnd;
      default:
        return pedido;
    }
  });

  // Handler del selector de filtro
  const handleFilterChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedFilter_Ventas(selectedValue);
    localStorage.setItem('selectedFilter_Ventas', selectedValue);
  };

  return (
    <div className= '' >
      <div className='bg-primary py-3.5 px-6 flex items-center justify-between align-middle'>
        <h1 className='PageTitle'>Listado de Ventas</h1>
        <Link to="/nuevoPedido">
          <button className='MainButton'>
            Nuevo Pedido
          </button>
        </Link>
      </div>

      <div className='bg-secondary flex justify-between items-center text-white p-2.5 px-6 mb-2'>
        <div className='flex items-center'>
          <label className='block'>Ventas </label>
          <select
            name="Datefilter"
            onChange={handleFilterChange}
            value={selectedFilter_Ventas}
            className="FilterField w-32"
          >
            <option value={"today"}>de Hoy</option>
            <option value={"week"}>de la Semana</option>
            <option value={"month"}>del Mes</option>
          </select>
        </div>
        <Link className='' to="/historialVentas">
          Historial de ventas completo
        </Link>
      </div>

      {loadingOrders ? (
        // Muestra los elementos de carga mientras se realizan las consultas
        <div className='p-5 pt-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingSkOrderShortView key={index} />
          ))}
        </div>
      ) : (
        <Paginador items={ventasFilter} ComponentToShow={PedidoShortView} propName={"pedido"} itemsPerPage={6} itemName={"Ventas"}/>
      )}
      
    </div>
  )
}
