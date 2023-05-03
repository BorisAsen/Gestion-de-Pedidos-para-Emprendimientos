// Importar el modulo express y guardarlo en una cte
//const express = require('express');
import express from 'express';
const app = express();

//Importar express-fileupload para el manejo de la subida de imagenes
import fileUpload from 'express-fileupload';

// Importar el archivo de configuracion
import { PORT } from "./config.js";

// Importar el index.routes
import indexRoutes from './routes/index.routes.js';

// Importar el enrutador de tareas
import taskRoutes from "./routes/tasks.routes.js";

// Importar el enrutador de productos
import productRoutes from "./routes/products.routes.js";

// Importar el modulo de cors
import cors from "cors";

// Importar las funciones necesarias para generar una constante, extraer la 
// ruta absoluta de los archivos de la carpeta dist y luego distribuirlos
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Extraer la ruta absoluta de los archivos en una constante
const __dirname = dirname(fileURLToPath(import.meta.url));
//console.log(__dirname);

// Indicar que app utilice el modulo cors para permitir peticiones desde el servidor de desarrollo del frontend
app.use(cors());

// Las peticiones antes de llegar a las rutas, se pasaran por una funcion json de express
// para que el sistema pueda procesarlo y entenderlo
app.use(express.json());

//Middleware de express-fileupload
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './upload'
}))

// Indicar que la aplicacion escucha por el puerto 3000
app.listen(PORT);
console.log(`Sever corriendo en el puerto ${PORT}`);

// Indicar que app haga uso de las rutas de indexRoutes
app.use(indexRoutes);

// Indicar que app haga uso de las rutas definidas en tasks.routes.js
app.use(taskRoutes);

// Indicar que app haga uso de las rutas definidas en products.routes.js
app.use(productRoutes);

// ***** BUILD *****//
// Distribuir los archivos estaticos de la carpeta dist
app.use(express.static(join(__dirname, '../client/dist')));









