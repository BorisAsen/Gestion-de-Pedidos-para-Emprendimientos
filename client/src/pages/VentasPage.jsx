import React from 'react'

// Importar el hook useEffect para mostrar informacion ni bien se carga la pagina
import { useEffect } from "react";

// Importar el componente para mostrar una tarjeta de pedido
import PedidoShortView from "../components/PedidoShortView";

// Importo el context global
import { useGlobalContext } from "../context/ContextProvider";

// Importo el Link para redirigir a los formularios de pedidos
import { Link } from "react-router-dom";

// Importar el Paginador
import Paginador from "../components/pagination/Paginador"

export default function VentasPage() {
  // Extraigo del context el arreglo de pedidos vacio y la funcion para cargarlo con los pedidos de la db
  const {pedidos, loadPedidos} = useGlobalContext();

  // Se ejecuta al cargar la pagina
  useEffect (() => {
    // Carga el arreglo de pedidos
    loadPedidos();
  }, []);

  // Filtro los pedidos SI entregados que seran el listado de ventas
  const pedidosFilter = pedidos.filter( (pedido) => pedido.done == 1 );

  return (
    <div className= '' >
      <div className='bg-white py-3.5 px-6 flex items-center justify-between mb-4 align-middle'>
        <h1 className='PageTitle'>Listado de Ventas</h1>
        <Link to="/nuevoPedido">
          <button className='MainButton'>
            Nuevo Pedido
          </button>
        </Link>
      </div>
      
      <Paginador items={pedidosFilter} ComponentToShow={PedidoShortView} itemsPerPage={6} componentName={"Ventas"}/>
    </div>
  )
}
