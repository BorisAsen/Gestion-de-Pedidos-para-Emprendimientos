import React from 'react'

// Importar el componente de busqueda
import ProductSearchBar from "../components/ProductoSearchBar"

// Importar el hook useEffect para mostrar informacion ni bien se carga la pagina
import { useEffect } from "react";

// Importo el context global
import { useGlobalContext } from "../context/ContextProvider";

// Importo el Link para redirigir a los formularios de pedidos
import { Link } from "react-router-dom";

export default function PedidosPage() {

  return (
    <div className='p-5'>
        <ProductSearchBar/>
    </div>
    
  )
}
