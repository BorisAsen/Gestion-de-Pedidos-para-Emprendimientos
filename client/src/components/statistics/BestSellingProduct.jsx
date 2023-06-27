import React, { useEffect, useState } from 'react';

// Importar el global context
import { useGlobalContext } from '../../context/ContextProvider';

// Importar ProductStatisticView
import ProductStatisticView from '../ProductStatisticView';

export default function BestSellingProduct({ period, value }) {
  
    // Importar las funciones para obtener el producto mas vendido segun el periodo
    const { getMonthlyBestSellingProduct, getYearlyBestSellingProduct } = useGlobalContext();

    // Estado para alamcenar el producto mas vendido
    const [bestSellingProduct, setBestSellingProduct] = useState({});

    // Funcion para obtener el producto mas vendido segun el periodo
    const fetchBestSellingProduct = async () => {
        try {
            if (period === 'month') {
                const monthlyResponse = await getMonthlyBestSellingProduct(value);
                setBestSellingProduct(monthlyResponse?.bestSellingProduct);

            } else if (period === 'year') {
                const yearlyResponse = await getYearlyBestSellingProduct(value);
                setBestSellingProduct(yearlyResponse?.bestSellingProduct);
            }
            } catch (error) {
            console.error('Error fetching best selling product data:', error);
        }
    };

    // Se ejecuta al cambiar los valores de periodo y valor
    useEffect(() => {
        fetchBestSellingProduct();
        //console.log('Best selling product:', bestSellingProduct);
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
                    Producto mas vendido de <span>{formatMonth(value)}</span>
                </h2>
                )}
                {period === 'year' && (
                <h2>
                    Producto mas vendido del <span>{value}</span>
                </h2>
                )}
            </div>
            <ProductStatisticView product={bestSellingProduct} />
        </div>
    );
}
