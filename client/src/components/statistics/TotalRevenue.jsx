import React, { useEffect, useState, useRef } from 'react';

// Importar librería para crear gráficos
import Chart from 'chart.js/auto';

// Importar el global context
import { useGlobalContext } from '../../context/ContextProvider';

export default function TotalRevenue({ period, value }) {
  
    // Importar las funciones para obtener las recaudaciones
    const { getMonthRevenue, getYearRevenue } = useGlobalContext();

    // Estado para alamcenar el total de la recaudacion mensual o anual
    const [revenue, setRevenue] = useState(0);

    // Estado para guardar el arreglo de la recaudación mensual
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);

    // Estado para guardar el arreglo de la recaudación anual
    const [yearlyRevenue, setYearlyRevenue] = useState([]);

    // Funcion para obtener las recaudaciones segun el periodo seleccionado
    const fetchRevenueData = async () => {
        try {
        if (period === 'month') {
            const monthlyResponse = await getMonthRevenue(value);
            const { monthRevenue } = monthlyResponse;
            // Sumar los valores del arreglo de recaudación mensual
            const totalMonthlyRevenue = monthRevenue.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
            );
            setRevenue(totalMonthlyRevenue);
            setMonthlyRevenue(monthRevenue);
            setYearlyRevenue([]); // Reiniciar los datos de recaudación anual
        } else if (period === 'year') {
            const yearlyResponse = await getYearRevenue(value);
            const { yearRevenue } = yearlyResponse;
            // Sumar los valores del arreglo de recaudación anual
            const totalYearlyRevenue = yearRevenue.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
            );
            setRevenue(totalYearlyRevenue);
            setMonthlyRevenue([]); // Reiniciar los datos de recaudación mensual
            setYearlyRevenue(yearRevenue);
        }
        } catch (error) {
        console.error('Error fetching revenue data:', error);
        }
    };

    // Se ejecuta al cambiar los valores de periodo y valor
    useEffect(() => {
        fetchRevenueData();
    }, [period, value]);


    // ************ GRAFICO ************ //
    // Referencia al elemento del grafico
    const chartRef = useRef(null);

    // Funcion para crear el grafico
    const createChart = () => {
        if (chartRef.current) {
        const labels = period === 'month' ? monthlyRevenue.map((_, index) => index + 1) : yearlyRevenue.map((_, index) => index + 1);
        const data = period === 'month' ? monthlyRevenue : yearlyRevenue;

        // Configuracion del grafico
        const chartData = {
            labels: labels,
            datasets: [
            {
                label: period === 'month' ? 'Recaudación Mensual' : 'Recaudación Anual',
                data: data,
                backgroundColor: 'rgba(80, 70, 220, 0.6)',
                pointBackgroundColor: 'rgba(80, 70, 220, 1)',
                fill: true,
                tension: 0.3,
            },
            ],
        };

        // Opciones del grafico
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
            y: {
                beginAtZero: true,
                ticks: {
                callback: function (value, index, values) {
                    return '$' + value;
                },
                },
            },
            },
            plugins: {
            tooltip: {
                callbacks: {
                title: function (context) {
                    const index = context[0].dataIndex;
                    const label =
                    period === 'month'
                        ? `${getDayAndMonth(index + 1)}`
                        : `${getMonthNameByNumber(index + 1)}`;

                    return label;
                },
                label: function (context) {
                    const value = context.parsed.y;
                    return `Total: $${value}`;
                },
                },
            },
            },
        };

        // Crear el grafico
        const chart = new Chart(chartRef.current, {
            type: 'line',
            data: chartData,
            options: chartOptions,
        });

        return chart;
        }
    };

    // Se ejecuta al variar los valores de periodo, recaudación mensual o recaudación anual
    useEffect(() => {
        const chart = createChart();

        return () => {
        if (chart) {
            chart.destroy();
        }
        };
    }, [period, monthlyRevenue, yearlyRevenue]);

    // ************ FIN GRAFICO ************ //

    // Funcion para obtener el dia y mes de la fecha
    const getDayAndMonth = (day) => {
        const date = new Date();
        date.setDate(day);
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    };

    // Funcion para obtener el nombre del mes por su numero
    const getMonthNameByNumber = (monthNumber) => {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleDateString('es-ES', { month: 'long' });
    };

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
                    Recaudación de <span>{formatMonth(value)}</span>
                </h2>
                )}
                {period === 'year' && (
                <h2>
                    Recaudación del año <span>{value}</span>
                </h2>
                )}
            </div>
            <div className="m-3 lg:mr-14 rounded-md justify-center items-center">
                <div className="mb-6 text-details_3 flex items-center justify-center">
                    <p className="m-auto font-mono text-xl">TOTAL</p>
                    <p className="m-auto font-mono text-6xl">${revenue ? revenue : '0'}</p>
                </div>
                <div className="flex text-orange-400 items-center justify-center">
                    <p className="m-auto font-mono text-xl">NETA</p>
                    <p className="m-auto font-mono text-6xl">${revenue ? revenue : '0'}</p>
                </div>
            </div>
            <div className='m-3 h-80 w-96'>
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
}
