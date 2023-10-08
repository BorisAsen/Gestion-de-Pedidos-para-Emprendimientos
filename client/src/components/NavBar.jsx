import React from 'react'
// Importo los enlaces que brinda react-router-dom
// Son un remplazo a las etiquetas "a" pero no refrescan la pagina
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

// Importo los iconos de React Icons
import { AiOutlineUser, AiOutlineProfile, AiOutlineFileDone } from 'react-icons/ai';
import { GiSchoolBag } from 'react-icons/gi';
import { VscGraphLine } from 'react-icons/vsc';

// Ruta de la imagen de perfil
import profilePicture from "../../assets/images/profile.jpg";

// Componente para los iconos de la NavBar
const NavBarIcon = ({ icon, text, image }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div
            className={`NavBar-item group relative`}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {image ? ( // Verifica si se proporciona una imagen
                <img className='NavBar-item-image' src={image} alt={text} />
            ) : (
                <span className='NavBar-item-icon'>{icon}</span>
            )}
            <span className='NavBar-tooltip hidden lg:block'>{text}</span>
            {showTooltip && (
                <span className='block lg:hidden absolute left-full p-1 px-1.5 ml-2 bg-slate-300 rounded-md'>
                    {text}
                </span>
            )}
        </div>
    );
};

export default function NavBar() {
    const navLinkStyles = ({isActive}) => {
        return isActive ? 'text-secondary font-bold' : 'text-slate-500';
    }

    // const navLinkProfile = ({isActive}) => {
    //     return isActive ? 'border-2 border-secondary text-red-500 font-bold' : 'text-slate-500';
    // }

    return (
        <div className=' z-50 bg-slate-100 flex flex-col fixed top-0 left-0 h-screen w-navBarCollapsed lg:w-navBarExtended text-navBar m-0 shadow-navBar'>
            <ul className='mt-4'>
                <li className=''>
                    {/* Perfil Usuario */}
                    {/* <NavLink >
                    <div className='w-10 h-10 lg:w-20 lg:h-20 mt-6 mb-5 lg:mb-8 flex items-center justify-center mx-auto rounded-full'>
                        <img className='w-full h-full object-cover rounded-full' src={profilePicture} alt="Usuario" />
                    </div>
                    </NavLink> */}
                    <NavLink to="/perfil" className={navLinkStyles}>
                        <NavBarIcon icon={<AiOutlineUser  size='25'/>} text='Usuario' image={profilePicture}/>
                    </NavLink>
                </li>

                <li>
                    {/* Tareas */}
                    <NavLink to="/" className={navLinkStyles}>
                        <NavBarIcon icon={<AiOutlineProfile  size='25'/>} text = 'Pedidos'/>
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
            <div className="border-t-2 border-slate-500 mt-auto p-2 text-center hidden lg:block">
                <p className='text-slate-500'>Willow - Gestión</p>
            </div>
        </div>
    )
}
