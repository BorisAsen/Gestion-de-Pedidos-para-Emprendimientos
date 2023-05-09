import React, { useState } from 'react';

// Importar el hook useEffect para mostrar informacion ni bien se carga la pagina
import { useEffect } from "react";

// Importar el context de productos
import { useGlobalContext } from "../context/ContextProvider";

// Importar el componente para mostrar una tarjeta de producto
import ProductoShortView from "../components/ProductoShortView";

const SearchBar = () => {
  // Extraigo del context las funciones para eliminar un producto
  const {products, loadProducts} = useGlobalContext();

  // Campo que recoge la informacion de busqueda
  const [search, setSearch] = useState('');

  // Se ejecuta al cargar la pagina
  useEffect (() => {
    // Carga el arreglo de productos
    loadProducts();
  }, []);
  
  // Funcion que se ejecuta cada vez que ocurra un cambio en el campo de busqueda
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const results = !search ? [] : products.filter( (dato) => dato.productName.toLowerCase().includes(search.toLocaleLowerCase()));


  // Funcion que renderiza el contenido del recuadro del resultado de la busqueda
  function renderSearchResult() {
    return results.map ((product) => <ProductoShortView product={product} key={product.id}/>)
  }

  return (
    <div>
      <label className='block'>Agregar Productos:</label>
      <input
      className='p-1 mt-0.5 rounded-md w-full'
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Buscar productos..."
      />

        <div className='grid grid-cols-4 gap-1 bg-white mt-3 h-60 overflow-auto p-2 rounded-md'>
            {renderSearchResult()}
            {/* {console.log('RESULTADO: ', results)} */}
        </div>
    </div>
  );
};

export default SearchBar;
