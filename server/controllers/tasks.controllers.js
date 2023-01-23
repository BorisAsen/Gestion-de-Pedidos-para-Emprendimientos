// Funciones para el CRUD de tareas

// Importar la conexion a la db
import { pool } from "../db.js"

// Funcion para crear una tarea
export const createTask = async (req, res) => {
    //res.send('Creando tareas');
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
}

// Funcion para obtener todas las tareas de la db
export const getTasks = async (req, res) => {
    //res.send('Obteniendo tareas')
    const [result] = await pool.query("SELECT * FROM tasks ORDER BY createAt ASC");
    // Devuelve un arreglo con todas las tareas
    console.log(result);
    res.json(result);
}

// Funcion para obtener una tarea mediante su id
export const getTask = async (req, res) => {
    //res.send('Obteniendo una tarea')
    const [result] = await pool.query("SELECT * FROM tasks WHERE id = ?", [req.params.id]);
    // Devuelve un arreglo de una sola tarea que coincide con el ID solicitado
    console.log(result);
    // Controlar que se devuelva un resultado de error si no existe el id solicitado
    if (result.length === 0) {
        return res.status(404).json({message: "Task not found"});
    };
    // Como se esta buscando por id, el resultado sera siempre unico,
    // Por lo que indico que el resultado sera el primer elemento del arreglo
    res.json(result[0]);
}

// Funcion para eliminar una tarea mediante su id
export const deleteTask = async (req, res) => {
    //res.send('Eliminando una tarea')
    /* 
       Aca, si bien no es necesario devolver un resultado luego de eliminar una tarea,
       Se utilizara el result.affectedRows para saber si la tarea que se desea eliminar
       realmente existe en la db, en el caso de no hacerlo se devolvera un msg de error
    */
    const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
        return res.status(404).json({message: "Task not found"});
    };
    // En el caso de si haber existido la tarea, el estado sera 204 indicando que se
    // elimino correctamente pero no devuelve ningun resultado
    return res.sendStatus(204);
}

// Funcion para actualizar una tarea mediante su id
export const updateTask = async (req, res) => {
    //res.send('Actualizando una tarea')
    // Los datos de los campos a actualizar se obtienen del req.body
    const result = await pool.query("UPDATE tasks SET ? WHERE id = ?", [req.body, req.params.id]);
    /* 
       De la misma manera que al eliminar una tarea hay que controlar que exista,
       lo mismo debe suceder al intentar actualizarla
    */
    if (result.affectedRows === 0) {
        return res.status(404).json({message: "Task not found"});
    };
    // En el caso de si haber existido la tarea, el estado sera 204 indicando que se
    // actualizo correctamente pero no devuelve ningun resultado
    return res.sendStatus(204);
}