import React, { useEffect, useState } from 'react';

// Importar el global context
import { useGlobalContext } from '../../context/ContextProvider';

// Importar ProductsStatisticView
import ProductsStatisticView from '../ProductsStatisticView';

export default function BestSellingProduct({ period, value }) {
  // Importar las funciones para obtener los productos más vendidos según el periodo
  const { getMonthlyBestSellingProducts, getYearlyBestSellingProducts } = useGlobalContext();

  // Estado para almacenar los productos más vendidos
  const [bestSellingProducts, setBestSellingProducts] = useState([]);

  // Función para obtener los productos más vendidos según el periodo
  const fetchBestSellingProducts = async () => {
    try {
      if (period === 'month') {
        const monthlyResponse = await getMonthlyBestSellingProducts(value);
        setBestSellingProducts(monthlyResponse?.bestSellingProducts || []);
      } else if (period === 'year') {
        const yearlyResponse = await getYearlyBestSellingProducts(value);
        setBestSellingProducts(yearlyResponse?.bestSellingProducts || []);
      }
    } catch (error) {
      console.error('Error fetching best selling products data:', error);
    }
  };

  // Se ejecuta al cambiar los valores de periodo y valor
  useEffect(() => {
    fetchBestSellingProducts();
  }, [period, value]);

  // Función para dar formato a la fecha
  const formatMonth = (month) => {
    const [year, monthNumber] = month.split('-');
    const date = new Date(year, monthNumber - 1);
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="Tarjeta flex flex-wrap m-4 p-4 pt-4 justify-center items-center">
      <div className="flex justify-center mb-4 items-center text-center w-full text-secondary text-lg font-bold">
        {period === 'month' && (
          <h2>
            Producto más vendido de <span>{formatMonth(value)}</span>
          </h2>
        )}
        {period === 'year' && (
          <h2>
            Producto más vendido del <span>{value}</span>
          </h2>
        )}
      </div>
      <ProductsStatisticView products={bestSellingProducts} />
    </div>
  );
}
