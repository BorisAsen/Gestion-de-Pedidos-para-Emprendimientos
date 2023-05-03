// Importo el createContext de react
import { createContext } from "react";
// Creo la constante para el contexto
const GlobalContext = createContext();

// Importo los hooks de react para utilizar el context
import { useContext, useState } from "react";

// Importo desde la API las funciones necesarias para manipular los pedidos
import { 
    getPedidosRequest,
    getPedidoRequest,
    deletePedidoRequest,
    createPedidoRequest,
    updatePedidoRequest,
    togglePedidoDoneRequest
} from "../api/pedidos.api";

// Importo desde la API las funciones necesarias para manipular los productos
import { 
    getProductsRequest,
    getProductRequest,
    deleteProductRequest,
    createProductRequest,
    updateProductRequest,
} from "../api/productos.api";

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

// Esta funcion retorna un componente Context, recibe un children 
// que es un componente cualquiera que se quiere que acceda al contexto,
// es decir que pueda tomar el dato de la propiedad value
export const GlobalContextProvider = ({children}) => {

/**************************** CONTEXT PEDIDOS ****************************/
    // Defino el arreglo de pedidos
    const [pedidos, setPedidos] = useState([]);

    // Funcion para cargar el arreglo de pedidos
    async function loadPedidos() {
        const response = await getPedidosRequest();
        // Muestro por consola el arreglo de pedidos que se encuentra en data
        //console.log(response.data);
    
        // Guardo el arreglo de pedidos en la vble pedidos
        setPedidos(response.data);
    }

    // Funcion para agregar un pedido
    const createPedido = async (pedido) => {
        try {
            const response = await createPedidoRequest(pedido);
            console.log(response);
            // Si en la pagina principal no se hubiera configurado mediante el useEfect
            // que cada vez que se recargue la pagina se carguen y se muestre el arreglo
            // de pedidos, otra forma de hacerlo seria seteando el arreglo de tareas con
            // una copia de su conenido MAS el pedido que se acaba de añadir. 
            //setPedidos(... pedido, response.data);
          } catch (error) {
            console.log(error);
        }
    }

    // Funcion para eliminar un pedido mediante el id que recibe
    // del evento onClick del boton Eliminar
    const deletePedido = async (id) => {
        try {
            // Ejecuto la funcion para eliminar el pedido
            const response = await deletePedidoRequest(id);
            console.log(response);
            // Actualizo el arreglo de pedidos para que ya no se muestre el pedido con el id que se acaba de eliminar
            setPedidos(pedidos.filter(pedido => pedido.id !== id));
        } catch (error) {
            console.log(error);
        }
    };

    // Funcion para traer un unico pedido mediante un id
    const getPedido = async (id) => {
        try {
            const response = await getPedidoRequest(id);
            return response.data;
        } catch (error) {
            console.log(error);   
        }
    };

    // Funcion para modificar un pedido mediante el id que recibe del evento onClick del boton Guardar
    const updatePedido = async (id, newFields) => {
        try {
            const response = await updatePedidoRequest(id, newFields);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    // Funcion para cambiar el estado de un pedido (done) 
    const togglePedidoDone = async (id) => {
        try {
            // Encontrar y obtener el pedido a modificar dentro del arreglo de pedidos
            const pedidoFound = pedidos.find((pedido) => pedido.id === id);
            // Llamar a la funcion para cambiar el estado del pedido obtenido
            const response = await togglePedidoDoneRequest(id, pedidoFound.done === 0 ? true : false);
            console.log(response);
            // Actualizar el pedido modificado para ver el resultado automaticamente en la pantalla
            setPedidos(
                pedidos.map((pedido) => pedido.id === id ? { ... pedido, done: !pedido.done } : pedido )
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
    const updateProduct = async (id, updateProduct) => {
        try {
            const response = await updateProductRequest(id, updateProduct);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

/**************************** DATOS Y FUNCIONES A EXPORTAR ****************************/
    return (<GlobalContext.Provider value={{
                // Pedidos
                pedidos,
                loadPedidos,
                deletePedido,
                createPedido,
                getPedido,
                updatePedido,
                togglePedidoDone,

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