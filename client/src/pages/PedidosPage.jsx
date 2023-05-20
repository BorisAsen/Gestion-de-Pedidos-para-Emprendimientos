import React from 'react'

// Importar el hook useEffect para mostrar informacion ni bien se carga la pagina
import { useEffect } from "react";

// Importar el componente para mostrar una tarjeta de pedido
import PedidoShortView from "../components/PedidoShortView";

// Importo el context global
import { useGlobalContext } from "../context/ContextProvider";

// Importo el Link para redirigir a los formularios de pedidos
import { Link } from "react-router-dom";

export default function PedidosPage() {
  // Extraigo del context el arreglo de pedidos vacio y la funcion para cargarlo con los pedidos de la db
  const {pedidos, loadPedidos} = useGlobalContext();

  // Se ejecuta al cargar la pagina
  useEffect (() => {
    // Carga el arreglo de pedidos
    loadPedidos();
  }, []);

  // Funcion que renderiza el contenido de la pagina principal
  // Muestra el arreglo de pedidos, si esta vacio muestra la leyenda correspondiente
  function renderMain() {
    if (pedidos.length === 0) {
      return <h1>No hay pedidos que mostrar</h1>
    }else{
      return pedidos.map ((pedido) => <PedidoShortView pedido={pedido} key={pedido.id}/>)
    }
  }

  return (
    <div className= '' >
      <div className='bg-white py-3.5 px-6 flex items-center justify-between mb-4 align-middle'>
        <h1 className='PageTitle'>Listado de Pedidos</h1>
        <Link to="/nuevoPedido">
          <button className='MainButton'>
            Nuevo Pedido
          </button>
        </Link>
      </div>
      
      <div className='relative z-0 p-5 pt-3 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {/* Se llama a la funcion que renderiza el contenido de la pagina */}
        {renderMain()}
      </div>
    </div>
  )
}
