import React from 'react'

// Importar el hook useEffect para mostrar informacion ni bien se carga la pagina
import { useEffect } from "react";

// Importar el componente para mostrar una tarjeta de tarea
import Tarea from "../components/Tarea";

// Importo el context de tareas
import { useTasks } from "../context/TasksProvider";


export default function TareasPage() {
  // Extraigo del context el arreglo de tareas vacio y la funcion para cargarlo con las tareas de la db
  const {tasks, loadTasks} = useTasks();

  // Se ejecuta al cargar la pagina
  useEffect (() => {
    // Carga el arreglo de tareas
    loadTasks();
  }, []);

  // Funcion que renderiza el contenido de la pagina principal
  // Muestra el arreglo de tareas, si esta vacio muestra la leyenda correspondiente
  function renderMain() {
    if (tasks.length === 0) {
      return <h1>No hay tareas que mostrar</h1>
    }else{
      return tasks.map ((task) => <Tarea task={task} key={task.id}/>)
    }
  }

  return (
    <div>
      <h1 className='PageTitle'>Listado de Tareas</h1>
      
      <div className='grid grid-cols-2 gap-3'>
        {/* Se llama a la funcion que renderiza el contenido de la pagina */}
        {renderMain()}
      </div>
    </div>
  )
}
