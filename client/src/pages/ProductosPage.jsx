import React from 'react'

// Importar el hook useEffect para mostrar informacion ni bien se carga la pagina
import { useEffect, useState } from "react";

// Importar el componente para mostrar una tarjeta de producto
import Producto from "../components/Producto";

// Importo el context de productos
import { useGlobalContext } from "../context/ContextProvider";

// Importo el Link para redirigir a los formularios de productos
import { Link } from "react-router-dom";

// Importar iconos
import { TbArrowsSort } from 'react-icons/tb';

// Importar el Paginador
import Paginador from "../components/pagination/Paginador"

// Importar el componente para mostrar el loading skeleton de producto
import LoadingSkProduct from '../loadingSkeletons/LoadingSkProduct';

export default function ProductosPage() {
  // Extraigo del context el arreglo de productos vacio y la funcion para cargarlo con los productos de la db
  const {products, loadProducts, loadInactiveProducts} = useGlobalContext();

  // Estado para el valor del filtro
  const [selectedFilter, setSelectedFilter] = useState("fecha de creacion");

  // Estado para guardar el valor del orden, ascendente o descendente
  const [sortOrder, setSortOrder] = useState("asc");

  // Estado que recoge la informacion del campo de busqueda
  const [search, setSearch] = useState('');

  // Estado para controlar si se muestran productos inactivos
  const [showInactiveProducts, setShowInactiveProducts] = useState(
    localStorage.getItem('showInactiveProducts') === 'true' ? true : false
  );

  // Estado para controlar la carga de los productos
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Se ejecuta al cargar la pagina
  useEffect (() => {
    // Cargar el arreglo de productos
    if (showInactiveProducts) {
      loadInactiveProducts(); // Carga los productos inactivos
    } else {
      loadProducts(); // Carga los productos activos
    }
    // Simular un retraso de 200 milisegundos para la animacion de carga de productos
    const delay = setTimeout(() => {
      setLoadingProducts(false); // Marca la carga como finalizada
    }, 200);

    // Recuperar el valor del filtro almacenado en localStorage (si existe)
    const storedFilterValue = localStorage.getItem('selectedFilter_Products');
    if (storedFilterValue) {
      setSelectedFilter(storedFilterValue);
    }

    // Recuperar el valor almacenado del orden de busqueda en localStorage (si existe)
    const storedSortOrder = localStorage.getItem("sortOrder_Products");
    if (storedSortOrder) {
      setSortOrder(storedSortOrder);
    }

    // Recuperar el valor del campo de busqueda en localStorage (si existe)
    const storedSearchValue = localStorage.getItem('searchContent_Products');
    if (storedSearchValue) {
      setSearch(storedSearchValue);
    }
    
  // }, [products]);
  }, [showInactiveProducts]);

  // Filtrar y ordenar los productos
  const productsFilter = products.slice().sort((a, b) => {
    if (selectedFilter === "fecha de creacion") {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
  
      if (sortOrder === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    } else if (selectedFilter === "costo") {
      if (sortOrder === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    }
  });

  // Handler del selector de filtro
  const handleFilterChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedFilter(selectedValue);
    localStorage.setItem('selectedFilter_Products', selectedValue);
  };

  //Handler del boton para cambiar el orden del listado
  const handleSortOrderChange = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    localStorage.setItem('sortOrder_Products', newSortOrder);
  };

  // Funcion que se ejecuta cada vez que ocurra un cambio en el campo de busqueda
  const handleSearchChange = (e) => {
    const selectedValue = e.target.value;
    setSearch(selectedValue);
    localStorage.setItem('searchContent_Products', selectedValue); // Guardar el valor del campo de busqueda en localstorage
  };

  // Handler para el selector de productos activos o inactivos
  const handleShowInactiveProductsChange = (e) => {
    const showInactiveProducts = e.target.checked;
    setShowInactiveProducts(showInactiveProducts);
    localStorage.setItem('showInactiveProducts', showInactiveProducts); // Guardar el estado del checkbox en localStorage
  };

  // Resultado de la busqueda
  const results = !search ? [] : products.filter( (dato) => dato.productName.toLowerCase().includes(search.toLocaleLowerCase()));

  // Arreglo de productos a mostrar
  // Si hay algun valor en el campo de busqueda, el resultado del mismo es lo que se carga en el arreglo final
  // Si no hay datos del campo de busqueda se muestra el arreglo de productos segun los filtros aplicados 
  const productsToShow = (search != '' ? results : productsFilter);

  return (
    <div className= '' >
      <div className='bg-primary py-3.5 px-6 flex items-center justify-between align-middle'>
        <h1 className='PageTitle'>Listado de Productos</h1>
        <Link to="/nuevoProducto">
          <button className='MainButton'>
            Nuevo producto
          </button>
        </Link> 
      </div>

      <div className='bg-secondary flex justify-between items-center text-white p-2.5 px-6 mb-2'>
        <div className='flex items-center'>
            <label className='block'>Productos </label>
            <select
                name="Datefilter"
                onChange={handleFilterChange}
                value={selectedFilter}
                disabled={search}
                className={`FilterField ${search !== '' ? ' text-red-500 disabled:cursor-not-allowed' : ''}`}
              >
                <option value={'fecha de creacion'}>Fecha de creacion</option>
                <option value={'costo'}>Costo</option>
            </select>
            <button className={`FilterButton p-1.5 ml-2 ${search ? ' bg-slate-300 text-red-400 disabled:cursor-not-allowed disabled:hover:bg-tertiary' : ''}`} disabled = {search} onClick={handleSortOrderChange}><TbArrowsSort/></button>       
            {selectedFilter === "costo" && (
              <span className="ml-2 text-sm">
                {sortOrder === "asc" ? "Mas barato a mas costoso" : "Mas costoso a mas barato"}
              </span>
            )}
            {selectedFilter === "fecha de creacion" && (
              <span className="ml-2 text-sm">
                {sortOrder === "asc" ? "Mas antiguo a mas reciente" : "Mas reciente a mas antiguo"}
              </span>
            )}
        </div>
        
        <div>
          <input
          className='FilterField p-0.5 px-1.5 w-full'
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Buscar productos..."
          />
        </div>
      </div>
      {/* Checkbox para mostrar productos inactivos */}
      <div className='m-5 my-3 flex items-center'>
        <label className='block m-0'>
          Solo productos inactivos:
        </label>
        <input
          type="checkbox"
          checked={showInactiveProducts}
          onChange={handleShowInactiveProductsChange}
          className="ml-2"
        />
      </div>
      {loadingProducts ? (
        // Muestra los elementos de carga mientras se realizan las consultas
        <div className='p-5 pt-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingSkProduct key={index} />
          ))}
        </div>
      ) : (
        <Paginador
            items={productsToShow}
            ComponentToShow={Producto}
            propName={'product'}
            itemsPerPage={6}
            itemName={'Productos'}
          /> 
      )}

    </div>
  )
}
