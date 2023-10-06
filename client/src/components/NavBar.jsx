import React from 'react'
// Importo los enlaces que brinda react-router-dom
// Son un remplazo a las etiquetas "a" pero no refrescan la pagina
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

// Importo los iconos de React Icons
import { AiOutlineUser, AiOutlineProfile, AiOutlineFileDone } from 'react-icons/ai';
import { GiSchoolBag } from 'react-icons/gi';
import { VscGraphLine } from 'react-icons/vsc';

// Componente para los iconos de la NavBar
const NavBarIcon = ({ icon, text = 'tooltip 💡' }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div
        className='NavBar-item group relative'
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        >
        <span className='NavBar-item-icon'>{icon}</span>
        <span className='NavBar-tooltip hidden lg:block'>
                {text}
        </span>
        {showTooltip && (
            <span className='block lg:hidden absolute left-full p-2 ml-2 w-auto bg-blackBase text-white rounded-md'>
            {text}
            </span>
        )}
        </div>
    );
};

export default function NavBar() {
    const navLinkStyles = ({isActive}) => {
        return isActive ? 'text-details_3 font-bold bg-red-500' : 'text-white';
    }

    return (
        <div className=' z-50 bg-blackBase flex flex-col fixed top-0 left-0 h-screen w-navBarCollapsed lg:w-navBarExtended m-0 shadow-navBar'>
            <ul >
                <li className='border-b-2 border-primary mb-5'>
                    {/* Perfil Usuario */}
                    <NavLink to="/" >
                        <div className='w-10 h-10 lg:w-20 lg:h-20 mt-6 mb-5 lg:mb-8 bg-white flex items-center justify-center mx-auto rounded-full'>
                            <AiOutlineUser size='40' color='black'/>
                        </div>
                    </NavLink>
                </li>

                <li>
                    {/* Tareas */}
                    <NavLink to="/" className={navLinkStyles}>
                        <NavBarIcon icon={<AiOutlineProfile size='25'/>} text = 'Pedidos'/>
                    </NavLink>
                </li>
                <li>
                    {/* Ventas */}
                    <NavLink to="/ventas" className={navLinkStyles}>
                        <NavBarIcon icon={<AiOutlineFileDone size='25'/>} text = 'Ventas'/>
                    </NavLink>
                </li>
                <li>
                    {/* Productos */}
                    <NavLink to="/productos" className={navLinkStyles}>
                        <NavBarIcon icon={<GiSchoolBag size='25'/>} text = 'Productos'/>
                    </NavLink>            
                </li>
                <li>
                    {/* Recaudacion y Estadisticas */}
                    <NavLink to="/recaudacion_y_estadisticas" className={navLinkStyles}>
                        <NavBarIcon icon={<VscGraphLine size='21'/>} text = 'Recaudación y Estadísticas'/>
                    </NavLink>             
                </li>
            </ul>
            <div className="border-t-2 border-white mt-auto p-2 text-center hidden lg:block">
                <p className='text-white font-bold'>Willow - Gestión</p>
            </div>
        </div>
    )
}
