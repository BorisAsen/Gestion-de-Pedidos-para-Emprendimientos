// Importar solo el modulo Router de express, permite crear multiples rutas
import { Router } from "express";
// Importar la cte de conexion a la db
import { pool } from "../dbPostgreSQL.js";

// Crear la cte del enrutador a partir del modulo Router
const router = Router();

/* 
    Crear una peticion que se ejecute cuando se visita la ruta /ping
    y ejecuta la consulta SELECT
    Recibe dos parametros, un request y un response
    Es un manejador de peticiones de express
    Es un metodo asincrono, por eso se coloca el await
    Devuelve como respuesta un json que diga ping
*/
router.get('/ping', async (req, res) => {
    const [rows] = await pool.query('SELECT 1 + 1 as result');
    console.log(rows[0]);
    res.json(rows[0]);
});



// Exportar el enrutador
export default router;


