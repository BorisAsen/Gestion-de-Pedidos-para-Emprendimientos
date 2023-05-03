// Funciones para el CRUD de pedidos

// Importar la conexion a la db
import { pool } from "../db.js"

// * Funcion para crear un pedido
export const createPedido = async (req, res) => {
    try {
        //res.send('Creando Pedidos');
        const {title, description} = req.body;
        const [result] = await pool.query(
            "INSERT INTO tasks(title, description) VALUES (?, ?)",
            [title, description]
        );
        console.log(result);
        res.json({
            id: result.insertId,
            title,
            description,
        }); 
    } catch (error) {
        /* Devuelve un mensaje de error con estado http 500 que indica
        que se acepto la solicitud pero un error impidio que se cumpliera */
        return res.status(500).json({message: error.message}); 
    }
    
}

// * Funcion para obtener todas las tareas de la db
export const getPedidos = async (req, res) => {
    try {
        //res.send('Obteniendo Pedidos')
        const [result] = await pool.query("SELECT * FROM tasks ORDER BY createAt DESC");
        // Devuelve un arreglo con todas los pedidos
        //console.log(result);
        console.log("Obteniendo Pedidos...")
        res.json(result); 
    } catch (error) {
        // Retornar el mensaje de error como respuesta
        return res.status(500).json({message: error.message});
    }
    
}

// * Funcion para obtener un pedido mediante su id
export const getPedido = async (req, res) => {
    try {
        //res.send('Obteniendo un Pedido')
        const [result] = await pool.query("SELECT * FROM tasks WHERE id = ?", [req.params.id]);
        // Devuelve un arreglo de un solo pedido que coincide con el ID solicitado
        console.log(result);
        // Controlar que se devuelva un resultado de error si no existe el id solicitado
        if (result.length === 0) {
            return res.status(404).json({message: "Pedido not found"});
        };
        // Como se esta buscando por id, el resultado sera siempre unico,
        // Por lo que indico que el resultado sera el primer elemento del arreglo
        res.json(result[0]);
    } catch (error) {
        // Retornar el mensaje de error como respuesta
        return res.status(500).json({message: error.message});
    }
}

// Funcion para eliminar un pedido mediante su id
export const deletePedido = async (req, res) => {
    try {
        //res.send('Eliminando un pedido')
        /* 
        Aca, si bien no es necesario devolver un resultado luego de eliminar un pedido,
        Se utilizara el result.affectedRows para saber si el pedido que se desea eliminar
        realmente existe en la db, en el caso de no hacerlo se devolvera un msg de error
        */
        const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({message: "Pedido not found"});
        };
        // En el caso de si haber existido el pedido, el estado sera 204 indicando que se
        // elimino correctamente pero no devuelve ningun resultado
        return res.sendStatus(204);
    } catch (error) {
        // Retornar el mensaje de error como respuesta
        return res.status(500).json({message: error.message});
    }


}

// Funcion para modificar un pedido mediante su id
export const updatePedido = async (req, res) => {
    //res.send('Modificando un pedido')
    // Los datos de los campos a modificar se obtienen del req.body
    const result = await pool.query("UPDATE tasks SET ? WHERE id = ?", [req.body, req.params.id]);
    /* 
       De la misma manera que al eliminar un pedido hay que controlar que exista,
       lo mismo debe suceder al intentar modificarlo
    */
    if (result.affectedRows === 0) {
        return res.status(404).json({message: "Pedido not found"});
    };
    // En el caso de si haber existido el pedido, el estado sera 204 indicando que se
    // actualizo correctamente pero no devuelve ningun resultado
    return res.sendStatus(204);
}