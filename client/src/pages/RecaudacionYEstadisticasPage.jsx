import React, { useState, useEffect } from 'react';

// Importar el componente para mostrar las recaudaciones
import TotalRevenue from '../components/statistics/TotalRevenue';

// Importar el componente para mostrar la cantidad de ventas
import SalesAmount from '../components/statistics/SalesAmount';

export default function RecaudacionYEstadisticas() {
  // Obtener el mes actual
  const getCurrentMonth = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };
  const currentMonth = getCurrentMonth();

  // Obtener el año actual
  const currentYear = new Date().getFullYear();

  // Estado para guardar el valor del periodo seleccionado
  const [selectedPeriod, setSelectedPeriod] = useState(
    localStorage.getItem('selectedPeriod') || 'month'
  );

  // Estado para el valor del input de mes
  const [selectedMonth, setSelectedMonth] = useState(
    localStorage.getItem('selectedMonth') || currentMonth
  );

  // Estado para el valor del input de año
  const [selectedYear, setSelectedYear] = useState(
    localStorage.getItem('selectedYear') || currentYear
  );

  //console.log(selectedPeriod, selectedMonth, selectedYear);

  // Guardar el valor del periodo seleccionado en el localStorage
  useEffect(() => {
    localStorage.setItem('selectedPeriod', selectedPeriod);
  }, [selectedPeriod]);

  // Guardar el valor del mes seleccionado en el localStorage
  useEffect(() => {
    localStorage.setItem('selectedMonth', selectedMonth);
  }, [selectedMonth]);

  // Guardar el valor del año seleccionado en el localStorage
  useEffect(() => {
    localStorage.setItem('selectedYear', selectedYear);
  }, [selectedYear]);

  return (
    <div className="">
      <div className="bg-white py-3.5 px-6 flex items-center justify-between align-middle">
        <h1 className="PageTitle">Estadísticas</h1>
      </div>

      <div className="bg-tertiary flex justify-between items-center text-white p-2.5 px-6 mb-2">
        <div className="flex items-center">
          <label className="block">Período </label>
          <select
            name="Period"
            onChange={(e) => setSelectedPeriod(e.target.value)}
            value={selectedPeriod}
            className="p-0.5 ml-2 rounded-md text-black w-32"
          >
            <option value={'month'}>Mensual</option>
            <option value={'year'}>Anual</option>
          </select>

          {/* Selector de mes */}
          {selectedPeriod === 'month' && (
            <input
              name="month"
              type="month"
              max={currentMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              value={selectedMonth}
              className="block px-1.5 rounded-md w-44 ml-2 text-black"
            />
          )}

          {/* Selector de año */}
          {selectedPeriod === 'year' && (
            <input
              type="number"
              min="1900"
              max={currentYear}
              step="1"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="block px-1.5 rounded-md w-24 ml-2 text-black"
            />
          )}
        </div>
      </div>

      <TotalRevenue
        period={selectedPeriod}
        value={selectedPeriod === 'month' ? selectedMonth : selectedYear}
      />

      <SalesAmount
        period={selectedPeriod}
        value={selectedPeriod === 'month' ? selectedMonth : selectedYear}
      />
    </div>
  );
}
