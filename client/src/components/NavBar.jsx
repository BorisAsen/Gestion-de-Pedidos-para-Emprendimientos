import React from 'react'
// Importo los enlaces que brinda react-router-dom
// Son un remplazo a las etiquetas "a" pero no refrescan la pagina
import { Link } from "react-router-dom";

// Importo los iconos de React Icons
import { AiOutlineFileAdd, AiOutlineProfile, AiOutlineFileDone } from 'react-icons/ai';
import { GiSchoolBag } from 'react-icons/gi';
import { VscGraphLine } from 'react-icons/vsc';

// Componente para los iconos de la NavBar
const NavBarIcon = ({icon, text = 'tooltip 💡'}) => (
    <div className='NavBar-icon group'>
        {icon}
        <span className='NavBar-tooltip group-hover:scale-100'>
            {text}
        </span>
    </div>
);

export default function NavBar() {
  return (
    <div className=' z-50 bg-blackBase flex flex-col fixed top-0 left-0 h-screen w-14 m-0 shadow-navBar'>
        <ul >
            <li>
                {/* Tareas */}
                <Link to="/">
                    <NavBarIcon icon={<AiOutlineProfile size='25'/>} text = 'Pedidos'/>
                </Link>
            </li>
            <li>
                {/* Ventas */}
                <Link to="/ventas">
                    <NavBarIcon icon={<AiOutlineFileDone size='25'/>} text = 'Ventas'/>
                </Link>
            </li>
            <li>
                {/* Productos */}
                <Link to="/productos">
                    <NavBarIcon icon={<GiSchoolBag size='25'/>} text = 'Productos'/>
                </Link>            
            </li>
            <li>
                {/* Estadisticas */}
                <Link to="/recaudacion_y_estadisticas">
                    <NavBarIcon icon={<VscGraphLine size='21'/> }text = 'Estadisticas'/>
                </Link>             
            </li>
        </ul>
    </div>
  )
}
