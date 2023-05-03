import React from 'react'

// Importar el hook useEffect para mostrar informacion ni bien se carga la pagina
import { useEffect } from "react";

// Importar el componente para mostrar una tarjeta de producto
import Producto from "../components/Producto";

// Importo el context de productos
import { useGlobalContext } from "../context/ContextProvider";

// Importo el Link para redirigir a los formularios de productos
import { Link } from "react-router-dom";

export default function ProductosPage() {
  // Extraigo del context el arreglo de productos vacio y la funcion para cargarlo con los productos de la db
  const {products, loadProducts} = useGlobalContext();

  // Se ejecuta al cargar la pagina
  useEffect (() => {
    // Carga el arreglo de productos
    loadProducts();
  }, []);

  // Funcion que renderiza el contenido de la pagina de productos
  // Muestra el arreglo de productos, si esta vacio muestra la leyenda correspondiente
  function renderMain() {
    if (products.length === 0) {
      return <h1>No hay productos que mostrar</h1>
    }else{
      return products.map ((product) => <Producto product={product} key={product.id}/>)
    }
  }

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
      
      <div className='p-5 pt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5'>
        {/* Se llama a la funcion que renderiza el contenido de la pagina */}
        {renderMain()}
      </div>
    </div>
  )
}
