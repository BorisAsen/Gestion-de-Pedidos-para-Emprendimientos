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

export default function PedidosPage() {
  // Extraigo del context el arreglo de pedidos vacio y la funcion para cargarlo con los pedidos de la db
  const {pedidos, loadPedidos} = useGlobalContext();

  // Estado para el valor del filtro de pedidos
  const [selectedFilter, setSelectedFilter] = useState("today");

  // Se ejecuta al cargar la pagina
  useEffect (() => {
    // Carga el arreglo de pedidos
    // Envio el 0 como parametro para indicar que se deben traer de la db los pedidos NO entregados
    loadPedidos(0);

    // Recuperar el valor almacenado en localStorage (si existe)
    const storedValue = localStorage.getItem('selectedFilter');
    if (storedValue) {
      setSelectedFilter(storedValue);
    }
  }, []);

  // Filtrar los pedidos por hoy, mañana, semana y mes
  const pedidosFilter = pedidos.filter((pedido) => {
    // Al ya traer de la db el listado de pedidos mensual, solo se debe controlar
    // cuando se seleccione hoy, mañana o semana para modificar el arreglo
    const pedidoDate = new Date(pedido.shippingDate);
    switch (selectedFilter) {
      case "today":
      const today = new Date().setHours(0, 0, 0, 0); // Fecha de hoy a las 00:00
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1); // Fecha de mañana a las 00:00
      return pedidoDate >= today && pedidoDate < tomorrow;

    case "tomorrow":
      const tomorrowT = new Date();
      tomorrowT.setDate(tomorrowT.getDate() + 1); // Fecha de mañana a las 00:00
      const currentDay = new Date().setHours(0, 0, 0, 0); // Fecha de hoy a las 00:00
      const nextDay = new Date(tomorrowT).setHours(0, 0, 0, 0); // Fecha de mañana a las 00:00
      return pedidoDate >= nextDay && pedidoDate < nextDay + 24 * 60 * 60 * 1000;
        
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
    setSelectedFilter(selectedValue);
    localStorage.setItem('selectedFilter', selectedValue);
  };

  return (
    <div className= ''>
      <div className='bg-white py-3.5 px-6 flex items-center justify-between align-middle'>
        <h1 className='PageTitle'>Listado de Pedidos</h1>
        <Link to="/nuevoPedido">
          <button className='MainButton'>
            Nuevo Pedido
          </button>
        </Link>
      </div>

      <div className='bg-tertiary flex justify-between items-center text-white p-2.5 px-6 mb-2'>
        <div className='flex items-center'>
            <label className='block'>Pedidos </label>
            <select
              name="Datefilter"
              onChange={handleFilterChange}
              value={selectedFilter}
              className="p-0.5 ml-2 rounded-md text-black w-32"
            >
              <option value={"today"}>de Hoy</option>
              <option value={"tomorrow"}>de Mañana</option>
              <option value={"week"}>de la Semana</option>
              <option value={"month"}>del Mes</option>
            </select>
          </div>
          <Link className='' to="/historialPedidos">
            Historial de pedidos completo
          </Link>          
      </div>

      <Paginador items={pedidosFilter} ComponentToShow={PedidoShortView} propName={"pedido"} itemsPerPage={6} itemName={"Pedidos"}/>
      
    </div>
  )
}
