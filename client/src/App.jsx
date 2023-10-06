import React from 'react';
// Importo el enrutador
import { Route, Routes } from "react-router-dom";

/********** PAGINAS **********/
// Importo el componente de la pagina principal
import PedidosPage from "./pages/PedidosPage";
// Importo el componente de la pagina para crear tareas
import PedidosForm from "./pages/PedidosForm";

// Importo el componente de la pagina de Productos
import ProductosPage from "./pages/ProductosPage";
// Importo el componente de la pagina para crear productos
import ProductosForm from "./pages/ProductosForm";

// Importo el componente de la pagina de Estadisticas
import RecaudacionYEstadisticas from "./pages/RecaudacionYEstadisticasPage";

// Importo el componente de la pagina de Ventas
import VentasPage from "./pages/VentasPage";

// Importo el componente que se mostrara cuando se solicite una pagina que no exista
import NotFoundPage from "./pages/NotFoundPage";

// Importar la pagina del historial de ventas completo
import VentasHistoryPage from "./pages/VentasHistoryPage";

// Importar la pagina del historial de pedidos completo
import PedidosHistoryPage from "./pages/PedidosHistoryPage";

/********** COMPONENTES **********/
// Importo el componente de la barra de navegacion
import NavBar from "./components/NavBar";
// Componente de la vista detallada de un pedido
import PedidoView from "./pages/PedidoView"

/********** CONTEXT **********/
// Importar el Contexto de tareas
import { GlobalContextProvider } from "./context/ContextProvider";

/********** CONTEXT **********/
// Importar la pagina de testeo del SearchBar
import TestSearchBar from "./pages/TestSearchBar"


export default function App() {
  return (
    <div className=" bg-primary min-h-screen">
      <div className="bg-primary">
        <NavBar/>
        <div className="ml-navBarCollapsed lg:ml-navBarExtended" >
          <GlobalContextProvider >
            <Routes>
              {/* Ruta de la pag principal de Pedidos*/}
              <Route path='/' element={<PedidosPage/>} />
              {/* Ruta de la pagina para crear tareas */}
              <Route path='/nuevoPedido' element={<PedidosForm/>} />
              {/* Ruta de la pagina para modificar tareas */}
              <Route path='/editarPedido/:id' element={<PedidosForm/>} />
              {/* Ruta que muestra la vista completa de un pedido */}
              <Route path='/vistaPedido/:id' element={<PedidoView/>} />
              {/* Ruta que muestra el historial de ventas completo */}
              <Route path='/historialVentas' element={<VentasHistoryPage/>} />
              {/* Ruta que muestra el historial de pedidos completo */}
              <Route path='/historialPedidos' element={<PedidosHistoryPage/>} />

              {/* Ruta de la pagina de Productos */}
              <Route path='/productos' element={<ProductosPage/>} />
              {/* Ruta de la pagina para crear productos */}
               <Route path='/nuevoProducto' element={<ProductosForm/>} />
              {/* Ruta de la pagina para modificar productos */}
              <Route path='/editarProducto/:id' element={<ProductosForm/>} />
              
              {/* Ruta de la pagina de Ventas */}
              <Route path='/ventas' element={<VentasPage/>} />
              
              {/* Ruta de la pagina de Estadisticas */}
              <Route path='/recaudacion_y_estadisticas' element={<RecaudacionYEstadisticas/>} />
              
              {/* Pagina por defecto que se mostrara cuando se solicite una pagina que no existe */}
              <Route path='*' element={<NotFoundPage/>} />


              {/* RUTAS DE TESTEO */}
              <Route path='/testSearchBar' element={<TestSearchBar/>} />
            </Routes>
          </GlobalContextProvider>
        </div>
      </div>
    </div>
  )
}
