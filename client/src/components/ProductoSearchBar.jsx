import React, { useState } from 'react';

// Importar el hook useEffect para mostrar informacion ni bien se carga la pagina
import { useEffect } from "react";

// Importar el context de productos
import { useGlobalContext } from "../context/ContextProvider";

// Importar el componente para mostrar la vista resumida del producto
import ProductoShortView from "../components/ProductoShortView";

// Importar el componente para mostrar la vista de producto seleccionado
import SelectedProductView from "../components/SelectedProductView";

const SearchBar = () => {
  // Extraigo del context las funciones para eliminar un producto
  const {products, loadProducts} = useGlobalContext();

  // Extraigo del context el arreglo de items (productos y sus cantidades)
  const { items, clearItems, setItems } = useGlobalContext();

  // Campo que recoge la informacion de busqueda
  const [search, setSearch] = useState('');

  // Se ejecuta al cargar la pagina
  useEffect (() => {
    // Carga el arreglo de productos
    loadProducts();
    // Cada vez que se llama al componente de busqueda y seleccion de productos para el pedido,
    // se limpia el arreglo de productos seleccionados ya que de lo contrario por mas que envie
    // el form de pedido o simplemente navege entre paginas para volver al formulario, quedaran
    // persistentes los items seleccionados para el pedido a menos que recargue la pagina
    clearItems();
    //setItems(itemsP);
  }, []);
  
  // Funcion que se ejecuta cada vez que ocurra un cambio en el campo de busqueda
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };
  const results = !search ? [] : products.filter( (dato) => dato.productName.toLowerCase().includes(search.toLocaleLowerCase()));

  // Funcion que renderiza el contenido del recuadro del resultado de la busqueda
  function renderSearchResult() {
    return results.map ((product) => <ProductoShortView product={product} itemsReceived={items} key={product.id}/>)
  }

  // Funcion que renderiza los productos seleccionados para el pedido
  function renderSelectedProducts() {
    return items.map ((item) => <SelectedProductView item={item} key={item.product.id}/>)
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
        </div>

        <label className='block mt-3'>Productos seleccionados:</label>
        <div className='grid grid-cols-4 gap-1.5 overflow-auto bg-white h-52 p-2 rounded-md'>
            {renderSelectedProducts()}
        </div>
    </div>
  );
};

export default SearchBar;
