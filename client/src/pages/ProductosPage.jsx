import React from 'react'

// Importar el hook useEffect para mostrar informacion ni bien se carga la pagina
import { useEffect } from "react";

// Importar el componente para mostrar una tarjeta de producto
import Producto from "../components/Producto";

// Importo el context de productos
import { useGlobalContext } from "../context/ContextProvider";

// Importo el Link para redirigir a los formularios de productos
import { Link } from "react-router-dom";

// Importar el Paginador
import Paginador from "../components/pagination/Paginador"

export default function ProductosPage() {
  // Extraigo del context el arreglo de productos vacio y la funcion para cargarlo con los productos de la db
  const {products, loadProducts} = useGlobalContext();

  // Se ejecuta al cargar la pagina
  useEffect (() => {
    // Carga el arreglo de productos
    loadProducts();
  }, []);

  return (
    <div className= '' >
      <div className='bg-white py-3.5 px-6 flex items-center justify-between mb-4 align-middle'>
        <h1 className='PageTitle'>Listado de Productos</h1>
        <Link to="/nuevoProducto">
          <button className='MainButton'>
            Nuevo producto
          </button>
        </Link> 
      </div>

      <Paginador items={products} ComponentToShow={Producto} itemsPerPage={6} itemName={"product"} componentName={"Productos"} />

    </div>
  )
}
