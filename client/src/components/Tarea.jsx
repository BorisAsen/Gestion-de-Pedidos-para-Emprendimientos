import React from 'react'

// Importar el context de tareas
import { useGlobalContext } from "../context/ContextProvider";

//Importar el hook para direccionar al formulario de tareas cuando se presione el boton editar
import { useNavigate } from "react-router-dom";

// Importo iconos de React Icons
import { MdDelete, MdFileDownloadDone } from 'react-icons/md';
import { AiFillEdit } from 'react-icons/ai';

// El componente recibe un elemento del arreglo de tareas
// y muestra todas las propiedades del mismo
export default function TaskCard({ task }) {

    // Extraigo del context las funciones para eliminar una tarea y cambiarle el estado
    const {deleteTask, toggleTaskDone} = useGlobalContext();

    // Declaro constante para disponer del useNavigate
    const navigate = useNavigate();

    // Funcion para ver el estado del campo done
    const handleDone = async () => {
        // Imprimo por consola el valor del campo done de la tarea para corroborar
        //console.log(taskDone);
        await toggleTaskDone(task.id);
    }

    return (
        <div className='Tarjeta'>
            <header className='flex justify-between'>
                <h2 className='text-xl font-bold'>{task.title}</h2>
                <span>{task.done == 1 ? "✅" : "❌"}</span>
            </header>
            <p className='bg-white rounded-md p-2 h-20 overflow-y-auto'>{task.description}</p>
            <span>{task.createAt}</span>
            <div className='flex flex-wrap gap-x-2 mt-3'>
                <button className='TaskCard-icon' onClick={() => deleteTask(task.id)}><MdDelete/></button>
                <button className='TaskCard-icon' onClick={() => navigate(`/editTarea/${task.id}`)}><AiFillEdit/></button>
                <button className='TaskCard-icon' onClick={() => handleDone(task.done)}><MdFileDownloadDone/></button>
            </div>
        </div>
  )
}
