/*
PAGINADOR ADAPTABLE a cualquier listado de elementos y su correspondiente componente para mostrarlos.
Para utilizarlo correctamente se deben especificar con cuidado las props y sus valores al llamarlo.
Por ejemplo: Si quiero listar Pedidos se haria de la siguiente manera

<Paginador items={pedidosFilter} ComponentToShow={PedidoShortView} propName={"pedido"} itemsPerPage={6} itemName={"Ventas"}/>

● pedidosFilter es el arreglo de elementos que se quiere mostrar.
● PedidoShortView es el componente que muestra los pedidos y recibe como prop "pedido"
    export default function PedidoCard({ pedido }) {
        .
        .
    }
● propName es el nombre de la prop con que se construye el componente para mostrar los
pedidos mostrado en el apartado anterior, en este caso es "pedido".
● itemsPerPage es el numero de items que se quiere mostrar por pagina.
● itemName es simplemente el nombre de los elementos para que, en el caso de estar vacio
el arreglo, se muestre una leyenda de que no hay 'elementos' que mostrar
*/

import React from "react";

import { useState } from "react";

// Importar iconos
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const Paginador = (props) => {
    const {items, ComponentToShow, propName, itemsPerPage, itemName, listView} = props;

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
        return <h1  className="ml-6" >No hay {itemName} que mostrar</h1>
    }else{
        const itemsPaginados = items.slice(startIndex, endIndex);
        return<div className="relative">
                <div className={`p-5 pt-1 mb-10 grid grid-cols-1 ${!listView ? 'sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5' : ''} `}>
                    {itemsPaginados.map((item) => {
                        const props = { [propName]: item }; // Crear el objeto de props dinámicamente
                        return <ComponentToShow {...props} key={item.id} />;
                    })}
                </div>
                <div className='fixed bottom-0 left-14 right-0 bg-white flex items-center justify-center h-10 p-3 shadow-Paginador'>
                    <button
                        className="Card-icon mr-2"
                        disabled={currentPage === 1}
                        onClick={PrevPage}
                    >
                        <MdKeyboardArrowLeft className="m-0.5"/>
                    </button>
                    <p>Pagina {currentPage}/{numbersOfPages}</p>
                    <button
                        className='Card-icon ml-2'
                        disabled={endIndex >= items.length}
                        onClick={NextPage}
                    >
                        <MdKeyboardArrowRight className="m-0.5"/>
                    </button>
                </div>
            </div>
    }
};

export default Paginador;