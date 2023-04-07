// Importo el context de tareas
// import { TaskContext } from "./TareasContext";
// // Importo el context de productos
// import { ProductContext } from "./ProductosContext";

// Importo el createContext de react
import { createContext } from "react";
// Creo la constante para el contexto
const GlobalContext = createContext();


// Importo los hooks de react para utilizar el context
import { useContext, useState } from "react";

// Importo desde la API las funciones necesarias para manipular las tareas
import { 
    getTasksRequest,
    getTaskRequest,
    deleteTaskRequest,
    createTaskRequest,
    updateTaskRequest,
    toggleTaskDoneRequest
} from "../api/tasks.api";

// Importo desde la API las funciones necesarias para manipular los productos
import { 
    getProductsRequest,
    getProductRequest,
    deleteProductRequest,
    createProductRequest,
    updateProductRequest,
} from "../api/products.api";

// Hook para usar el contexto global en todos los componentes
export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    // Si no existe el contexto significa que no se esta dentro del componente ContextProvider
    if (!context) {
        throw new Error("useGlobalContext debe ser usado con ContextProvider");
    }
    // Si existe el contexto se lo retorna para que pueda ser importado
    return context;
}

// Hook para usar el Context de productos
// export const useProducts = () => {
//     const context = useContext(ProductContext);
//     // Si no existe el contexto significa que no se esta dentro del componente ContextProvider
//     if (!context) {
//         throw new Error("useProducts must be used within a ContextProvider");
//     }
//     // Si existe el contexto se lo retorna para que pueda ser importado
//     return context;
// }

// Esta funcion retorna un componente Context, recibe un children 
// que es un componente cualquiera que se quiere que acceda al contexto,
// es decir que pueda tomar el dato de la propiedad value
export const GlobalContextProvider = ({children}) => {

/**************************** CONTEXT TAREAS ****************************/
    // Defino el arreglo de tareas
    const [tasks, setTasks] = useState([]);

    // Funcion para cargar el arreglo de tareas
    async function loadTasks() {
        const response = await getTasksRequest();
        // Muestro por consola el arreglo de tareas que se encuentra en data
        //console.log(response.data);
    
        // Guardo el arreglo de tareas en la vble tasks
        setTasks(response.data);
    }

    // Funcion para agregar una tarea
    const createTask = async (task) => {
        try {
            const response = await createTaskRequest(task);
            console.log(response);
            // Si en la pagina principal no se hubiera configurado mediante el useEfect
            // que cada vez que se recargue la pagina se carguen y se muestre el arreglo
            // de tareas, otra forma de hacerlo seria seteando el arreglo de tareas con
            // una copia de su conenido MAS la tarea que se acaba de añadir. 
            //setTasks(... task, response.data);
          } catch (error) {
            console.log(error);
        }
    }

    // Funcion para eliminar una tarea mediante el id que recibe
    // del evento onClick del boton Eliminar
    const deleteTask = async (id) => {
        try {
            // Ejecuto la funcion para eliminar la tarea
            const response = await deleteTaskRequest(id);
            console.log(response);
            // Actualizo el arreglo de tareas para que
            // ya no se muestre la tarea con el id que se acaba de eliminar
            setTasks(tasks.filter(task => task.id !== id));

        } catch (error) {
            console.log(error);
        }
    };

    // Funcion para traer una unica tarea mediante un id
    const getTask = async (id) => {
        try {
            const response = await getTaskRequest(id);
            return response.data;
        } catch (error) {
            console.log(error);   
        }
    };

    // Funcion para modificar una tarea mediante el id que recibe
    // del evento onClick del boton Guardar
    const updateTask = async (id, newFields) => {
        try {
            const response = await updateTaskRequest(id, newFields);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    // Funcion para cambiar el estado de una tarea (done) 
    const toggleTaskDone = async (id) => {
        try {
            // Encontrar y obtener la tarea a modificar dentro del arreglo de tareas
            const taskFound = tasks.find((task) => task.id === id);
            // Llamar a la funcion para cambiar el estado de la tarea obtenida
            const response = await toggleTaskDoneRequest(id, taskFound.done === 0 ? true : false);
            console.log(response);
            // Actualizar la tarea modificada para ver el resultado automaticamente en la pantalla
            setTasks(
                tasks.map((task) => task.id === id ? { ... task, done: !task.done } : task )
            )
        } catch (error) {
            console.log(error);
        }
    };

/**************************** CONTEXT PRODUCTOS ****************************/
    // Defino el arreglo de productos
    const [products, setProducts] = useState([]);

    // Funcion para cargar el arreglo de productos
    async function loadProducts() {
        const response = await getProductsRequest();
        // Muestro por consola el arreglo de productos que se encuentra en data
        //console.log(response.data);
    
        // Guardo el arreglo de productos en la vble products
        setProducts(response.data);
    }

    // Funcion para agregar un producto
    const createProduct = async (product) => {
        try {
            const response = await createProductRequest(product);
            console.log(response);
          } catch (error) {
            console.log(error);
        }
    }

    // Funcion para eliminar un producto mediante el id que recibe
    // del evento onClick del boton Eliminar
    const deleteProduct = async (id) => {
        try {
            // Ejecuto la funcion para eliminar el producto
            const response = await deleteProductRequest(id);
            console.log(response);
            // Actualizo el arreglo de productos para que
            // ya no se muestre el producto con el id que se acaba de eliminar
            setProducts(products.filter(product => product.id !== id));

        } catch (error) {
            console.log(error);
        }
    };

    // Funcion para traer un unico producto mediante un id
    const getProduct = async (id) => {
        try {
            const response = await getProductRequest(id);
            return response.data;
        } catch (error) {
            console.log(error);   
        }
    };

    // Funcion para modificar un producto mediante el id que recibe
    // del evento onClick del boton Guardar
    const updateProduct = async (id, newFields) => {
        try {
            const response = await updateProductRequest(id, newFields);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };


/**************************** DATOS Y FUNCIONES A EXPORTAR ****************************/
    return (<GlobalContext.Provider value={{
                // Tareas
                tasks,
                loadTasks,
                deleteTask,
                createTask,
                getTask,
                updateTask,
                toggleTaskDone,

                // Productos
                products,
                loadProducts,
                deleteProduct,
                createProduct,
                getProduct,
                updateProduct

            }}>
                {children}
            </GlobalContext.Provider>
    );
}