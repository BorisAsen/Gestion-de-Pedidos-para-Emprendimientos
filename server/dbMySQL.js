// Importar el modulo de mysql2
import { createPool } from "mysql2/promise";

// Crear la costante de conexion a la DB
export const pool = createPool({
    host: 'localhost', //Esto funciona porque al momento de crear el contenedor de docker para la db se indico que el puerto con el que se trabajara son los puertos por defecto de la pc y del contenedor mysql
    port: 3306, // Es indistinto ponerlo ya que, nuevamente, se lo coloco en el comando para crear el contenedor de mysql con docker
    user: 'root',
    password: '12345',
    database: 'tasksdb'
});








