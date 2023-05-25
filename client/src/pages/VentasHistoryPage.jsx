import React from 'react'

// Importar el hook useEffect para mostrar informacion ni bien se carga la pagina
import { useEffect, useState } from "react";

// Importar el componente para mostrar una tarjeta de pedido
import PedidoRowtView from "../components/PedidoRowView";

// Importo el context global
import { useGlobalContext } from "../context/ContextProvider";

// Importo el Link para redirigir a los formularios de pedidos
import { Link } from "react-router-dom";

// Importar iconos
import { TbArrowsSort, TbEraser } from 'react-icons/tb';
import { BiSearchAlt } from 'react-icons/bi';

// Importar el Paginador
import Paginador from "../components/pagination/Paginador"

export default function VentasHistoryPage() {
  // Extraigo del context el arreglo de pedidos vacio y la funcion para cargarlo con los pedidos de la db
  const {pedidos, setPedidos, loadAllPedidos, loadMonthYearPedidos, loadDatePedidos} = useGlobalContext();

  // Estado para el valor del filtro
  const [Ventas_FiltrarPor, setVentas_FiltrarPor] = useState("mes_y_año");

  // Estado para el valor del tipo de busqueda
  const [Ventas_BuscarPor, setVentas_BuscarPor] = useState("producto");

  // Constantes para extraer el dia, mes y año actual con los que
  // se inializaran selectedMonth y selectedDate
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentDay = currentDate.getDate().toString().padStart(2, '0');
  // Estado para el valor del input de mes y año
  const [selectedMonth, setSelectedMonth] = useState(`${currentYear}-${currentMonth}`);
  // Estado para el valor del input de dia especifico
  const [selectedDate, setSelectedDate] = useState(`${currentYear}-${currentMonth}-${currentDay}`);

  // Estado para mostrar y limpiar el resultado de la busqueda
  const [search_clean, setSearch_clean] = useState('clean');


  // Se ejecuta al cargar la pagina
  useEffect (() => {
    // Recuperar el valor almacenado de Ventas_FiltrarPor en localStorage (si existe)
    const storedValue_Ventas_FiltrarPor = localStorage.getItem('Ventas_FiltrarPor');
    if (storedValue_Ventas_FiltrarPor) {
      setVentas_FiltrarPor(storedValue_Ventas_FiltrarPor);
    }

    // Recuperar el valor almacenado de Ventas_BuscarPor en localStorage (si existe)
    const storedValue_Ventas_BuscarPor = localStorage.getItem('Ventas_BuscarPor');
    if (storedValue_Ventas_BuscarPor) {
      setVentas_BuscarPor(storedValue_Ventas_BuscarPor);
    }

    // Recuperar el valor almacenado de searchValue en localStorage (si existe)
    const storedValue_searchField = localStorage.getItem('searchField');
    if (storedValue_searchField) {
      setSearchField(storedValue_searchField);
    }

    // Recuperar el valor almacenado de sortOrder en localStorage (si existe)
    const storedSortOrder = localStorage.getItem("sortOrder");
    if (storedSortOrder) {
      setSortOrder(storedSortOrder);
    }
  }, []);

  // Handler del selector de filtro
  const handleFilterChange = (e) => {
    const selectedValue = e.target.value;
    setVentas_FiltrarPor(selectedValue);
    localStorage.setItem('Ventas_FiltrarPor', selectedValue);
  };

  // Handler del selector de tipo de busqueda
  const handleSearchTypeChange = (e) => {
    const selectedValue = e.target.value;
    setVentas_BuscarPor(selectedValue);
    localStorage.setItem('Ventas_BuscarPor', selectedValue);
  };
  
  // Filtrar las ventas por mes y año, dia especifico y todos las ventas
  const search = async () => {
    switch (Ventas_FiltrarPor) {
      case "mes_y_año":
        await loadMonthYearPedidos(1, selectedMonth);
        break;
      case "todos":
        await loadAllPedidos(1);
        break;
      case "dia":
        await loadDatePedidos(1, selectedDate)
        break;
      default:
        break;
    }
    setSearch_clean('search');
  }

  const clean = () => {
    setSearch_clean('clean');
    setPedidos([]);
  }


  // Filtrar los pedidos según el tipo de búsqueda seleccionado
  // Estado que recoge la informacion del campo de busqueda
  const [searchField, setSearchField] = useState('');
  // Funcion que se ejecuta cada vez que ocurra un cambio en el campo de busqueda
  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
    localStorage.setItem('searchField', searchField); // Guardar el valor en localStorage
  };

  const searchFieldLowercase = searchField.toLowerCase();
  // Filtrar los pedidos por dirección
  const filterPedidosByAddress = () => {
    return pedidos.filter(pedido => pedido.address.toLowerCase().includes(searchFieldLowercase));
  };
  // Filtrar los pedidos por cliente
  const filterPedidosByClient = () => {
    return pedidos.filter(pedido => pedido.client.toLowerCase().includes(searchFieldLowercase));
  };
  // Filtrar los pedidos por forma de pago
  const filterPedidosByPayment = () => {
    return pedidos.filter(pedido => pedido.payment.toLowerCase().includes(searchFieldLowercase));
  };
  // Filtrar los pedidos por nombre de producto
  const filterPedidosByProduct = () => {
    return pedidos.filter(pedido => {
      return pedido.items.some(item => item.product.productName.toLowerCase().includes(searchFieldLowercase));
    });
  };

  let filteredPedidos = pedidos;
  if (searchField !== '') {
    switch (Ventas_BuscarPor) {
      case "direccion":
        filteredPedidos = filterPedidosByAddress();
        break;
      case "cliente":
        filteredPedidos = filterPedidosByClient();
        break;
      case "forma_de_pago":
        filteredPedidos = filterPedidosByPayment();
        break;
      case "producto":
        filteredPedidos = filterPedidosByProduct();
        break;
      default:
        break;
    }
  }

  // Estado para guardar el valor del orden, ascendente o descendente
  const [sortOrder, setSortOrder] = useState("desc");
  //Handler del boton para cambiar el orden del listado
  const handleSortOrderChange = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    localStorage.setItem("sortOrder", newSortOrder); // Guardar el valor en localStorage
  };
  // Ordenar el arreglo de ventas segun el orden seleccionado
  const orderedVentas = filteredPedidos.slice().sort((a, b) => {
    const dateA = new Date(a.shippingDate);
    const dateB = new Date(b.shippingDate);
    if (sortOrder === "asc") {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  return (
    <div className= '' >
      <div className='bg-white py-3.5 px-6 flex items-center justify-between align-middle'>
        <h1 className='PageTitle'>Historial de ventas completo</h1>
        <Link to="/nuevoPedido">
          <button className='MainButton'>
            Nuevo Pedido
          </button>
        </Link>
      </div>

      <div className='bg-tertiary flex flex-wrap items-center justify-between px-6 mb-2'>
        <div className='flex flex-wrap p-1.5 pl-0 items-center justify-center'>
          <div className='flex flex-wrap p-1.5 pl-0 items-center justify-center'>
            <label className='block text-white'>Filtrar por:</label>
            <select
              name="Datefilter"
              onChange={handleFilterChange}
              value={Ventas_FiltrarPor}
              className="block p-0.5 rounded-md text-black w-32 m-1"
            >
              <option value={"mes_y_año"}>Mes y Año</option>
              <option value={"dia"}>Dia específico</option>
              <option value={"todos"}>Todos</option>
            </select>
            {Ventas_FiltrarPor === "mes_y_año" && (
              <input
                type="month"
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="block px-1.5 rounded-md w-44 m-1"
              />
              )}
              {Ventas_FiltrarPor === "dia" && (
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="block px-1.5 rounded-md w-36 m-1"
              />
            )}
          </div>

          <div className='flex flex-wrap p-1.5 pl-0 items-center justify-center'>
              <label className='block text-white'>Buscar por:</label>
              <select
                name="BuscarPor"
                onChange={handleSearchTypeChange}
                value={Ventas_BuscarPor}
                className="block p-0.5 m-1 rounded-md w-36"
              >
                <option value={"producto"}>Producto</option>
                <option value={"direccion"}>Direccion</option>
                <option value={"cliente"}>Cliente</option>
                <option value={"forma_de_pago"}>Forma de pago</option>
              </select>
              <input
                className='block p-0.5 px-1.5 rounded-md w-36 m-1'
                  type="text"
                  value={searchField}
                  onChange={handleSearchFieldChange}
                  placeholder="Buscar..."
              />
          </div>
        </div>
        <div className='flex flex-wrap p-1.5 pl-0 pr-0 items-center justify-center'>
          <button onClick={() => search()} className='Card-icon p-1.5'><BiSearchAlt/></button>
          <button onClick={() => clean()} className='Card-icon p-1.5 ml-2'><TbEraser/></button>
          <button onClick={handleSortOrderChange} className={`Card-icon p-1.5 ml-2 }`}><TbArrowsSort/></button>
        </div>
      </div>

      <div className=''>
        <div className='px-5 py-2 grid grid-cols-11 gap-1'>
            <h2 className='PedidoRowViewFieldHeader col-span-3 rounded-bl-md rounded-tl-md'><b>Titulo</b></h2>
            <span className='PedidoRowViewFieldHeader col-span-2'><b>Fecha de entrega</b></span>
            <span className='PedidoRowViewFieldHeader col-span-2'><b>Cliente</b></span>
            <span className='PedidoRowViewFieldHeader col-span-2'><b>Dirección</b></span>
            <span className='PedidoRowViewFieldHeader col-span-1'><b>Total</b></span>
            <span className='PedidoRowViewFieldHeader col-span-1 rounded-br-md rounded-tr-md'><b>Ver</b></span>
        </div>
        
        <Paginador items={orderedVentas} ComponentToShow={PedidoRowtView} propName={"pedido"} itemsPerPage={15} itemName={"Ventas"} listView={true}/>

      </div>
    </div>
  )
}
