import React, { useEffect, useState, useRef } from 'react';

// Importar el global context
import { useGlobalContext } from '../../context/ContextProvider';

export default function TotalRevenue({ period, value }) {
  
    // Importar las funciones para obtener las cantidades de ventas segun el periodo
    const { getMonthSales, getYearSales } = useGlobalContext();

    // Estado para alamcenar la cantidad de ventas total
    const [salesAmount, setSalesAmount] = useState(0);

    // // Estado para almacenar la cantidad de ventas mensuales
    // const [monthlySalesAmount, setMonthlySalesAmount] = useState(0);

    // // Estado para almacenar la cantidad de ventas anuales
    // const [yearlySalesAmount, setYearlySalesAmount] = useState(0);

    // Funcion para obtener la cantidad de ventas segun el periodo
    const fetchSalesAmount = async () => {
        try {
            if (period === 'month') {
                const monthlyResponse = await getMonthSales(value);
                setSalesAmount(monthlyResponse);

            } else if (period === 'year') {
                const yearlyResponse = await getYearSales(value);
                setSalesAmount(yearlyResponse);
            }
            } catch (error) {
            console.error('Error fetching sales amount data:', error);
        }
    };

    // Se ejecuta al cambiar los valores de periodo y valor
    useEffect(() => {
        fetchSalesAmount();
    }, [period, value]);

    // Funcion para dar formato a la fecha
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
                    Cantidad de ventas de <span>{formatMonth(value)}</span>
                </h2>
                )}
                {period === 'year' && (
                <h2>
                    Cantidad de ventas del <span>{value}</span>
                </h2>
                )}
            </div>
            <p className="m-auto text-details_3 font-mono text-6xl">{salesAmount.salesAmount}</p>
        </div>
    );
}
