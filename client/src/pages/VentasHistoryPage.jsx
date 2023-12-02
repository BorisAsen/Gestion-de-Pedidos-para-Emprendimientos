import React from 'react'

// Importar el hook useEffect para mostrar informacion ni bien se carga la pagina
import { useEffect, useState } from "react";

// Importar el componente para mostrar una tarjeta de pedido
import PedidoRowView from "../components/PedidoRowView";

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

  // Estado para el valor del orden, ascendente o descendente
  const [Ventas_OrdenarPor, setVentas_OrdenarPor] = useState("asc");

  // Estado que recoge la informacion del campo de busqueda
  const [Ventas_CampoBusqueda, setVentas_CampoBusqueda] = useState('');

  // Constantes para extraer el dia, mes y año actual con los que
  // se inializaran selectedMonth y selectedDate
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentDay = currentDate.getDate().toString().padStart(2, '0');
  // Estado para el valor del input de mes y año
  const [Ventas_SelectedMonth, setVentas_SelectedMonth] = useState(`${currentYear}-${currentMonth}`);
  // Estado para el valor del input de dia especifico
  const [Ventas_SelectedDate, setVentas_SelectedDate] = useState(`${currentYear}-${currentMonth}-${currentDay}`);

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

    // Recuperar el valor almacenado de Pedidos_OrdenarPor en localStorage (si existe)
    const storedValue_Ventas_OrdenarPor = localStorage.getItem('Ventas_OrdenarPor');
    if (storedValue_Ventas_OrdenarPor) {
      setVentas_OrdenarPor(storedValue_Ventas_OrdenarPor);
    }

    // Recuperar el valor almacenado de Ventas_CampoBusqueda en localStorage (si existe)
    const storedValue_Ventas_CampoBusqueda = localStorage.getItem('Ventas_CampoBusqueda');
    if (storedValue_Ventas_CampoBusqueda) {
      setVentas_CampoBusqueda(storedValue_Ventas_CampoBusqueda);
    }

    // Recuperar el valor almacenado de Ventas_SelectedDate en localStorage (si existe)
    const storedValue_Ventas_SelectedDate = localStorage.getItem('Ventas_SelectedDate');
    if (storedValue_Ventas_SelectedDate) {
      setVentas_SelectedDate(storedValue_Ventas_SelectedDate);
    }

    // Recuperar el valor almacenado de Ventas_SelectedMonth en localStorage (si existe)
    const storedValue_Ventas_SelectedMonth = localStorage.getItem('Ventas_SelectedMonth');
    if (storedValue_Ventas_SelectedMonth) {
      setVentas_SelectedMonth(storedValue_Ventas_SelectedMonth);
    }

  }, [Ventas_FiltrarPor, Ventas_BuscarPor, Ventas_OrdenarPor, Ventas_CampoBusqueda, Ventas_SelectedDate, Ventas_SelectedMonth]);

  useEffect(() => {
    search();
  }, [Ventas_FiltrarPor, Ventas_BuscarPor, Ventas_OrdenarPor, Ventas_CampoBusqueda, Ventas_SelectedDate, Ventas_SelectedMonth]);

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

  //Handler del boton para cambiar el orden del listado
  const handleSortOrderChange = () => {
    const newSortOrder = Ventas_OrdenarPor === "asc" ? "desc" : "asc";
    setVentas_OrdenarPor(newSortOrder);
    localStorage.setItem('Ventas_OrdenarPor', newSortOrder);
  };

  //Handler del input Ventas_SelectedDate
  const handleVentas_SelectedDateChange = (e) => {
    const selectedValue = e.target.value;
    setVentas_SelectedDate(selectedValue);
    localStorage.setItem('Ventas_SelectedDate', selectedValue);
  };

  //Handler del input Ventas_SelectedMonth
  const handleVentas_SelectedMonthChange = (e) => {
    const selectedValue = e.target.value;
    setVentas_SelectedMonth(selectedValue);
    localStorage.setItem('Ventas_SelectedMonth', selectedValue);
  };

  // Funcion que se ejecuta cada vez que ocurra un cambio en el campo de busqueda
  const handleSearchFieldChange = (e) => {
    const searchValue = e.target.value;
    setVentas_CampoBusqueda(searchValue);
    localStorage.setItem('Ventas_CampoBusqueda', searchValue);
  };


  // Filtrar los pedidos según el tipo de búsqueda seleccionado
  // Filtrar los pedidos por mes y año, dia especifico y todos las ventas
  const search = async () => {
    // console.log("BUSCANDO");
    switch (Ventas_FiltrarPor) {
      case "mes_y_año":
        await loadMonthYearPedidos(1, Ventas_SelectedMonth);
        break;
      case "todos":
        await loadAllPedidos(1);
        break;
      case "dia":
        await loadDatePedidos(1, Ventas_SelectedDate)
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

  const searchFieldLowercase = Ventas_CampoBusqueda.toLowerCase();
  // Filtrar las ventas por dirección
  const filterVentasByAddress = () => {
    return pedidos.filter(pedido => pedido.address.toLowerCase().includes(searchFieldLowercase));
  };
  // Filtrar los ventas por cliente
  const filterVentasByClient = () => {
    return pedidos.filter(pedido => pedido.client.toLowerCase().includes(searchFieldLowercase));
  };
  // Filtrar los ventas por forma de pago
  const filterVentasByPayment = () => {
    return pedidos.filter(pedido => pedido.payment.toLowerCase().includes(searchFieldLowercase));
  };
  // Filtrar los ventas por nombre de producto
  const filterVentasByProduct = () => {
    return pedidos.filter(pedido => {
      return pedido.items.some(item => item.product.productName.toLowerCase().includes(searchFieldLowercase));
    });
  };

  let filteredVentas = pedidos;
  if (Ventas_CampoBusqueda !== '') {
    switch (Ventas_BuscarPor) {
      case "direccion":
        filteredVentas = filterVentasByAddress();
        break;
      case "cliente":
        filteredVentas = filterVentasByClient();
        break;
      case "forma_de_pago":
        filteredVentas = filterVentasByPayment();
        break;
      case "producto":
        filteredVentas = filterVentasByProduct();
        break;
      default:
        break;
    }
  }


  // Ordenar el arreglo de ventas segun el orden seleccionado
  const orderedVentas = filteredVentas.slice().sort((a, b) => {
    const dateA = new Date(a.shippingDate);
    const dateB = new Date(b.shippingDate);
    if (Ventas_OrdenarPor === "asc") {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  return (
    <div className= '' >
      <div className='bg-primary py-3.5 px-6 flex items-center justify-between align-middle'>
        <h1 className='PageTitle'>Historial de ventas completo</h1>
        <Link to="/nuevoPedido">
          <button className='MainButton'>
            Nuevo Pedido
          </button>
        </Link>
      </div>

      <div className='bg-secondary flex flex-wrap items-center justify-between px-6 mb-2'>
        <div className='flex flex-wrap p-1.5 pl-0 items-center justify-center'>
          <div className='flex flex-wrap p-1.5 pl-0 items-center justify-center'>
            <label className='block text-white'>Filtrar por:</label>
            <select
              name="Datefilter"
              onChange={handleFilterChange}
              value={Ventas_FiltrarPor}
              className="FilterField w-32 m-1"
            >
              <option value={"mes_y_año"}>Mes y Año</option>
              <option value={"dia"}>Dia específico</option>
              <option value={"todos"}>Todos</option>
            </select>
            {Ventas_FiltrarPor === "mes_y_año" && (
              <input
                type="month"
                value={Ventas_SelectedMonth}
                onChange={handleVentas_SelectedMonthChange}
                className="FilterField w-44 m-1"
              />
              )}
              {Ventas_FiltrarPor === "dia" && (
              <input
                type="date"
                value={Ventas_SelectedDate}
                onChange={handleVentas_SelectedDateChange}
                className="FilterField w-36 m-1"
              />
            )}
          </div>

          <div className='flex flex-wrap p-1.5 pl-0 items-center justify-center'>
              <label className='block text-white'>Buscar por:</label>
              <select
                name="BuscarPor"
                onChange={handleSearchTypeChange}
                value={Ventas_BuscarPor}
                className="FilterField m-1 w-36"
              >
                <option value={"producto"}>Producto</option>
                <option value={"direccion"}>Dirección</option>
                <option value={"cliente"}>Cliente</option>
                <option value={"forma_de_pago"}>Forma de pago</option>
              </select>
              <input
                className='FilterField w-36 m-1'
                  type="text"
                  value={Ventas_CampoBusqueda}
                  onChange={handleSearchFieldChange}
                  placeholder="Buscar..."
              />
          </div>
        </div>
        <div className='flex flex-wrap p-1.5 pl-0 pr-0 items-center justify-center'>
          {/* <button onClick={() => search()} name='searchButton' className='Card-icon p-1.5'><BiSearchAlt/></button>
          <button onClick={() => clean()} className='Card-icon p-1.5 ml-2'><TbEraser/></button> */}
          <button onClick={handleSortOrderChange} className={`FilterButton p-1.5 ml-2 }`}><TbArrowsSort/></button>
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
        
        <Paginador items={orderedVentas} ComponentToShow={PedidoRowView} propName={"pedido"} itemsPerPage={15} itemName={"Ventas"} listView={true}/>

      </div>
    </div>
  )
}
