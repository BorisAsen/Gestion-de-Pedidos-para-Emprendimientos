// Importar el módulo pg
import pkg from 'pg';

// Obtener la clase Pool del paquete
const { Pool } = pkg;

// Crear la constante de conexión a la DB
export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Willow',
  password: '1234',
  port: 5432, // Puerto por defecto de PostgreSQL
});
