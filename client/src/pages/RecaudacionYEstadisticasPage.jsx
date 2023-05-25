import React from 'react'

// Importar el hook useEffect para mostrar informacion ni bien se carga la pagina
import { useEffect, useState } from "react";

// Importar el componente para mostrar una tarjeta de pedido
import PedidoShortView from "../components/PedidoShortView";

// Importo el context global
import { useGlobalContext } from "../context/ContextProvider";

// Importo el Link para redirigir a los formularios de pedidos
import { Link } from "react-router-dom";

// Importar el Paginador
import Paginador from "../components/pagination/Paginador"

export default function RecaudacionYEstadisticas() {
  // Extraigo del context el arreglo de pedidos vacio y la funcion para cargarlo con los pedidos de la db
  const { getMonthYearRevenue } = useGlobalContext();

  // Estado para guardar la recaudacion mensual
  const [monthYearRevenue, setMonthYearRevenue] = useState(null);

  
  //Funcion para obtener el mes actual
  const getCurrentMonth = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };
  // Estado para el valor del input de recaudacion mensual
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());



  // Se ejecuta al cargar la pagina
  useEffect(() => {
    const fetchMonthYearRevenue = async () => {
      const response = await getMonthYearRevenue(currentMonth);
      const { totalRevenue } = response;
      setMonthYearRevenue(totalRevenue);
    };
  
    fetchMonthYearRevenue();
  }, [currentMonth]);
  



  return (
    <div className= ''>
      <div className='bg-white py-3.5 px-6 flex items-center justify-between align-middle'>
        <h1 className='PageTitle'>Estadísticas</h1>
      </div>

      

    <div className='Tarjeta flex flex-wrap m-4 p-5 justify-center lg:justify-between'>
      <div className='rounded-md justify-center items-center'>
        <div className='p-2 mb-5 flex-wrap'>
          <label className='m-1'>Recaudacion de:</label>
          <input
              type="month"
              max={getCurrentMonth()}
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
              className="rounded-md p-1 px-1.5 w-44 ml-1"
            />
        </div>
        <div className='mb-8 flex items-center justify-center'>
          <p className='m-auto text-details_2 font-mono text-xl'>TOTAL</p>
          <p className='m-auto text-details_2 font-mono text-6xl'>${monthYearRevenue ? monthYearRevenue : '0'}</p>
        </div>

        <div className='flex items-center justify-center'>
          <p className='m-auto text-details_2 font-mono text-xl'>NETA</p>
          <p className='m-auto text-details_2 font-mono text-6xl'>${monthYearRevenue ? monthYearRevenue : '0'}</p>
        </div>
      </div>
      
      <div className='bg-blue-500 p-2 w-1/2 h-64'>
        Grafica
      </div>
    </div>
      

      
      {/* <Paginador items={pedidos} ComponentToShow={PedidoShortView} propName={"pedido"} itemsPerPage={6} itemName={"Pedidos"}/> */}
      
    </div>
  )
}
