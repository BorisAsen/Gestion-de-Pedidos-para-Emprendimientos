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

export default function VPedidosHistoryPage() {

  return (
    <div className= '' >
      <div className='bg-white py-3.5 px-6 flex items-center justify-between align-middle'>
        <h1 className='PageTitle'>Historial de pedidos completo</h1>
        <Link to="/nuevoPedido">
          <button className='MainButton'>
            Nuevo Pedido
          </button>
        </Link>
      </div>
    </div>
  )
}
