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

// Importar el componente para mostrar el loading skeleton de pedido
import LoadingSkOrderRowView from '../loadingSkeletons/LoadingSkOrderRowView';

export default function PedidosHistoryPage() {
  // Extraigo del context el arreglo de pedidos vacio y la funcion para cargarlo con los pedidos de la db
  const {pedidos, setPedidos, loadAllPedidos, loadMonthYearPedidos, loadDatePedidos} = useGlobalContext();

  // Estado para el valor del filtro
  const [Pedidos_FiltrarPor, setPedidos_FiltrarPor] = useState("mes_y_año");

  // Estado para el valor del tipo de busqueda
  const [Pedidos_BuscarPor, setPedidos_BuscarPor] = useState("producto");

  // Estado para el valor del orden, ascendente o descendente
  const [Pedidos_OrdenarPor, setPedidos_OrdenarPor] = useState("asc");

  // Estado que recoge la informacion del campo de busqueda
  const [Pedidos_CampoBusqueda, setPedidos_CampoBusqueda] = useState('');

  // Estado para controlar la carga de los pedidos
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Constantes para extraer el dia, mes y año actual con los que
  // se inializaran selectedMonth y selectedDate
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentDay = currentDate.getDate().toString().padStart(2, '0');
  // Estado para el valor del input de mes y año
  const [Pedidos_SelectedMonth, setPedidos_SelectedMonth] = useState(`${currentYear}-${currentMonth}`);
  // Estado para el valor del input de dia especifico
  const [Pedidos_SelectedDate, setPedidos_SelectedDate] = useState(`${currentYear}-${currentMonth}-${currentDay}`);

  // Estado para mostrar y limpiar el resultado de la busqueda
  const [search_clean, setSearch_clean] = useState('clean');


  // Se ejecuta al cargar la pagina
  useEffect (() => {
    // Recuperar el valor almacenado de Pedidos_FiltrarPor en localStorage (si existe)
    const storedValue_Pedidos_FiltrarPor = localStorage.getItem('Pedidos_FiltrarPor');
    if (storedValue_Pedidos_FiltrarPor) {
      setPedidos_FiltrarPor(storedValue_Pedidos_FiltrarPor);
    }

    // Recuperar el valor almacenado de Pedidos_BuscarPor en localStorage (si existe)
    const storedValue_Pedidos_BuscarPor = localStorage.getItem('Pedidos_BuscarPor');
    if (storedValue_Pedidos_BuscarPor) {
      setPedidos_BuscarPor(storedValue_Pedidos_BuscarPor);
    }

    // Recuperar el valor almacenado de Pedidos_OrdenarPor en localStorage (si existe)
    const storedValue_Pedidos_OrdenarPor = localStorage.getItem('Pedidos_OrdenarPor');
    if (storedValue_Pedidos_OrdenarPor) {
      setPedidos_OrdenarPor(storedValue_Pedidos_OrdenarPor);
    }

    // Recuperar el valor almacenado de Pedidos_CampoBusqueda en localStorage (si existe)
    const storedValue_Pedidos_CampoBusqueda = localStorage.getItem('Pedidos_CampoBusqueda');
    if (storedValue_Pedidos_CampoBusqueda) {
      setPedidos_CampoBusqueda(storedValue_Pedidos_CampoBusqueda);
    }

    // Recuperar el valor almacenado de Pedidos_SelectedDate en localStorage (si existe)
    const storedValue_Pedidos_SelectedDate = localStorage.getItem('Pedidos_SelectedDate');
    if (storedValue_Pedidos_SelectedDate) {
      setPedidos_SelectedDate(storedValue_Pedidos_SelectedDate);
    }

    // Recuperar el valor almacenado de Pedidos_SelectedMonth en localStorage (si existe)
    const storedValue_Pedidos_SelectedMonth = localStorage.getItem('Pedidos_SelectedMonth');
    if (storedValue_Pedidos_SelectedMonth) {
      setPedidos_SelectedMonth(storedValue_Pedidos_SelectedMonth);
    }

    // Simular un retraso de 200 milisegundos para la animacion de carga de pedidos
    const delay = setTimeout(() => {
      setLoadingOrders(false); // Marca la carga como finalizada
    }, 200);

  }, [Pedidos_FiltrarPor, Pedidos_BuscarPor, Pedidos_OrdenarPor, Pedidos_CampoBusqueda, Pedidos_SelectedDate, Pedidos_SelectedMonth]);

  useEffect(() => {
    search();
  }, [Pedidos_FiltrarPor, Pedidos_BuscarPor, Pedidos_OrdenarPor, Pedidos_CampoBusqueda, Pedidos_SelectedDate, Pedidos_SelectedMonth]);

  // Handler del selector de filtro
  const handleFilterChange = (e) => {
    const selectedValue = e.target.value;
    setPedidos_FiltrarPor(selectedValue);
    localStorage.setItem('Pedidos_FiltrarPor', selectedValue);
  };

  // Handler del selector de tipo de busqueda
  const handleSearchTypeChange = (e) => {
    const selectedValue = e.target.value;
    setPedidos_BuscarPor(selectedValue);
    localStorage.setItem('Pedidos_BuscarPor', selectedValue);
  };

  //Handler del boton para cambiar el orden del listado
  const handleSortOrderChange = () => {
    const newSortOrder = Pedidos_OrdenarPor === "asc" ? "desc" : "asc";
    setPedidos_OrdenarPor(newSortOrder);
    localStorage.setItem('Pedidos_OrdenarPor', newSortOrder);
  };

  //Handler del input Pedidos_SelectedDate
  const handlePedidos_SelectedDateChange = (e) => {
    const selectedValue = e.target.value;
    setPedidos_SelectedDate(selectedValue);
    localStorage.setItem('Pedidos_SelectedDate', selectedValue);
  };

  //Handler del input Pedidos_SelectedMonth
  const handlePedidos_SelectedMonthChange = (e) => {
    const selectedValue = e.target.value;
    setPedidos_SelectedMonth(selectedValue);
    localStorage.setItem('Pedidos_SelectedMonth', selectedValue);
  };

  // Funcion que se ejecuta cada vez que ocurra un cambio en el campo de busqueda
  const handleSearchFieldChange = (e) => {
    const searchValue = e.target.value;
    setPedidos_CampoBusqueda(searchValue);
    localStorage.setItem('Pedidos_CampoBusqueda', searchValue);
  };


  // Filtrar los pedidos según el tipo de búsqueda seleccionado
  // Filtrar los pedidos por mes y año, dia especifico y todos las ventas
  const search = async () => {
    // console.log("BUSCANDO");
    switch (Pedidos_FiltrarPor) {
      case "mes_y_año":
        await loadMonthYearPedidos(0, Pedidos_SelectedMonth);
        break;
      case "todos":
        await loadAllPedidos(0);
        break;
      case "dia":
        await loadDatePedidos(0, Pedidos_SelectedDate)
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

  const searchFieldLowercase = Pedidos_CampoBusqueda.toLowerCase();
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
  if (Pedidos_CampoBusqueda !== '') {
    switch (Pedidos_BuscarPor) {
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


  // Ordenar el arreglo de ventas segun el orden seleccionado
  const orderedVentas = filteredPedidos.slice().sort((a, b) => {
    const dateA = new Date(a.shippingDate);
    const dateB = new Date(b.shippingDate);
    if (Pedidos_OrdenarPor === "asc") {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  return (
    <div className= '' >
      <div className='bg-primary py-3.5 px-6 flex items-center justify-between align-middle'>
        <h1 className='PageTitle'>Historial de pedidos completo</h1>
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
              value={Pedidos_FiltrarPor}
              className="FilterField w-32 m-1"
            >
              <option value={"mes_y_año"}>Mes y Año</option>
              <option value={"dia"}>Dia específico</option>
              <option value={"todos"}>Todos</option>
            </select>
            {Pedidos_FiltrarPor === "mes_y_año" && (
              <input
                type="month"
                value={Pedidos_SelectedMonth}
                onChange={handlePedidos_SelectedMonthChange}
                className="FilterField w-44 m-1"
              />
              )}
              {Pedidos_FiltrarPor === "dia" && (
              <input
                type="date"
                value={Pedidos_SelectedDate}
                onChange={handlePedidos_SelectedDateChange}
                className="FilterField w-36 m-1"
              />
            )}
          </div>

          <div className='flex flex-wrap p-1.5 pl-0 items-center justify-center'>
              <label className='block text-white'>Buscar por:</label>
              <select
                name="BuscarPor"
                onChange={handleSearchTypeChange}
                value={Pedidos_BuscarPor}
                className="FilterField w-36 m-1"
              >
                <option value={"producto"}>Producto</option>
                <option value={"direccion"}>Direccion</option>
                <option value={"cliente"}>Cliente</option>
                <option value={"forma_de_pago"}>Forma de pago</option>
              </select>
              <input
                className='FilterField w-36 m-1'
                  type="text"
                  value={Pedidos_CampoBusqueda}
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

        {loadingOrders ? (
          // Muestra los elementos de carga mientras se realizan las consultas
          <div className='p-5 pt-1'>
            {Array.from({ length: 4 }).map((_, index) => (
              <LoadingSkOrderRowView key={index} />
            ))}
          </div>
        ) : (
          <Paginador items={orderedVentas} ComponentToShow={PedidoRowView} propName={"pedido"} itemsPerPage={15} itemName={"Pedidos"} listView={true}/>
        )}
        
      </div>
    </div>
  )
}
