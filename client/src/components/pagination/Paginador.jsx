import React from "react";

import { useState } from "react";

// Importar iconos
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const Paginador = (props) => {
    const {items, ComponentToShow, itemsPerPage, componentName, itemName} = props;

    // Estados necesarios para la paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const numbersOfPages = Math.ceil(items.length / itemsPerPage);

    // Handlers de los botones
    const PrevPage = () => {
        setCurrentPage(currentPage - 1);
        window.scrollTo({
          top: 0,
          behavior: "smooth", // Desplazamiento suave
        });
    };
    const NextPage = () => {
        setCurrentPage(currentPage + 1);
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Desplazamiento suave
        });
    };

    if (items.length === 0) {
        return <h1>No hay {componentName} que mostrar</h1>
    }else{
        const pedidosPaginados = items.slice(startIndex, endIndex);
        return<div className="relative">
                <div className='p-5 pt-1 mb-14 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
                    { pedidosPaginados.map((pedido) => <ComponentToShow element={pedido} key={pedido.id}/>) }
                </div>
                <div className='fixed bottom-0 left-14 right-0 bg-white flex items-center justify-center h-14 p-3 shadow-Paginador'>
                    <button
                        className="Card-icon mr-2 p-1.5"
                        disabled={currentPage === 1}
                        onClick={PrevPage}
                    >
                        <MdKeyboardArrowLeft/>
                    </button>
                    <p>Pagina {currentPage} / {numbersOfPages}</p>
                    <button
                        className='Card-icon ml-2 p-1.5'
                        disabled={endIndex >= items.length}
                        onClick={NextPage}
                    >
                        <MdKeyboardArrowRight/>
                    </button>
                </div>
            </div>
    }
};

export default Paginador;