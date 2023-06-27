// Funciones para el CRUD de pedidos

// Importar la conexion a la db
import { pool } from "../db.js"

// * Funcion para crear un pedido
export const createPedido = async (req, res) => {
    try {
        //res.send('Creando Pedidos');
        // Se toman los datos del body
        const {title, description, done, shippingDate, withdrawOrSend, address, client, deliveryCost, total, payment, items} = req.body;

        // En el form del frontend, al dejar el checkbox sin marcar por defecto, cuando se envian
        // los datos el campo done viene como null por lo que es necesario controlarlo y si este
        // es el caso asumir que es 0 (no entrgado), de otra forma aceptar el valor que trae
        done ? done : 0;
        const [result] = await pool.query(
            "INSERT INTO orders(title, description, done, shippingDate, withdrawOrSend, address, client, deliveryCost, total, payment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [title, description, done, shippingDate, withdrawOrSend, address, client, deliveryCost, total, payment]
        );
        // console.log(result);

        // Se obtiene el id del pedido que se acaba de agregar
        const orderId = result.insertId;

        // Recorrer el arreglo de items del pedido agregandolos a la tabla orders_products
        items.forEach(async (item) => {
            const { product, quantity } = item;
        
            // Insertar en la tabla "orders_products"
            await pool.query(
                "INSERT INTO orders_products(order_id, product_id, quantity) VALUES (?, ?, ?)",
                [orderId, product.id, quantity]
            );
        }); 

        res.json({
            id: result.insertId,
            title,
            description,
            done,
            shippingDate,
            withdrawOrSend,
            address,
            client,
            deliveryCost,
            total,
            payment
        });

        //console.log("Arreglo de items: ", items);
    } catch (error) {
        /* Devuelve un mensaje de error con estado http 500 que indica
        que se acepto la solicitud pero un error impidio que se cumpliera */
        return res.status(500).json({message: error.message}); 
    }
}

// * Funcion para obtener todos los pedidos de la db
export const getAllPedidos = async (req, res) => {
    try {
        //res.send('Obteniendo Pedidos')

        // Obtener el parametro done para segun su valor devolver los pedidos o las ventas
        const { done } = req.params;

        // Construir la consulta base que trae los pedidos del trimestre actual
        let query = "SELECT * FROM orders";
        
        // Si done es 1 o 0 se agrega el valor en la consulta
        (done === '1' || done === '0') ? query += ` WHERE done = ${done}` : '';
        
        // Por ultimo se agrega el orden de las filas segun el campo que guarda la fecha de entrega
        query += " ORDER BY shippingDate ASC";

        const [result] = await pool.query(query);

        // Recorrer el arreglo de pedidos y agregarle a cada uno el areglo items
        // que contiene todos los productos y cantidades asociados a cada pedido
        const newResult = result.map(async (pedido) => {
            const [items] = await pool.query("SELECT * FROM orders_products WHERE order_id = ?", [pedido.id]);
            
            // Ahora por cada item del arreglo de filas que se obtuvieron del SELECT a orders_products
            // hay que traer el producto correspondiente y armar el arreglo de items
            const updatedItems = await Promise.all(
                items.map(async (item) => {
                    const [product] = await pool.query("SELECT * FROM products WHERE id = ?", [item.product_id]);
                    return {
                        product: product[0],
                        quantity: item.quantity
                    };
                })
            );
            
            return {
            ...pedido,
            items: updatedItems
            };
        });

        // Esperar a que todas las promesas se resuelvan y no ocasionen errores
        const newResultPromises = await Promise.all(newResult);

        // console.log("Promises: ", newResultPromises);
        res.json(newResultPromises); 
    } catch (error) {
        // Retornar el mensaje de error como respuesta
        return res.status(500).json({message: error.message});
    }  
}

// * Funcion para obtener todos los pedidos del mes actual
export const getPedidos = async (req, res) => {
    try {
        //res.send('Obteniendo Pedidos')

        // Obtener el parametro done para segun su valor devolver los pedidos o las ventas
        const { done } = req.params;

        // Construir la consulta base que trae los pedidos del trimestre actual
        let query = "SELECT * FROM orders WHERE MONTH(shippingDate) = MONTH(CURDATE()) AND YEAR(shippingDate) = YEAR(CURDATE())";
        
        // Si done es 1 o 0 se agrega el valor en la consulta
        (done === '1' || done === '0') ? query += ` AND done = ${done}` : '';
        
        // Por ultimo se agrega el orden de las filas segun el campo que guarda la fecha de entrega
        query += " ORDER BY shippingDate ASC";


        const [result] = await pool.query(query);

        // Recorrer el arreglo de pedidos y agregarle a cada uno el areglo items
        // que contiene todos los productos y cantidades asociados a cada pedido
        const newResult = result.map(async (pedido) => {
            const [items] = await pool.query("SELECT * FROM orders_products WHERE order_id = ?", [pedido.id]);
            
            // Ahora por cada item del arreglo de filas que se obtuvieron del SELECT a orders_products
            // hay que traer el producto correspondiente y armar el arreglo de items
            const updatedItems = await Promise.all(
                items.map(async (item) => {
                    const [product] = await pool.query("SELECT * FROM products WHERE id = ?", [item.product_id]);
                    return {
                        product: product[0],
                        quantity: item.quantity
                    };
                })
            );
            
            return {
            ...pedido,
            items: updatedItems
            };
        });

        // Esperar a que todas las promesas se resuelvan y no ocasionen errores
        const newResultPromises = await Promise.all(newResult);

        // console.log("Promises: ", newResultPromises);
        res.json(newResultPromises); 
    } catch (error) {
        // Retornar el mensaje de error como respuesta
        return res.status(500).json({message: error.message});
    }
}

// * Funcion para obtener todos los pedidos de un mes especifico
export const getMonthYearPedidos = async (req, res) => {
    try {
      const { done, monthYear } = req.params;
        
      // Obtener el mes y el año del parámetro monthYear
      const [year, month] = monthYear.split("-");

      // Construir la consulta para traer los pedidos del mes y año específico
      let query = `SELECT * FROM orders WHERE YEAR(shippingDate) = ${year} AND MONTH(shippingDate) = ${month}`;
  
      if (done === '1' || done === '0') {
        query += ` AND done = ${done}`;
      }
  
      query += " ORDER BY shippingDate ASC";
  
      const [result] = await pool.query(query);
  
      const newResult = await Promise.all(
        result.map(async (pedido) => {
          const [items] = await pool.query("SELECT * FROM orders_products WHERE order_id = ?", [pedido.id]);
  
          const updatedItems = await Promise.all(
            items.map(async (item) => {
              const [product] = await pool.query("SELECT * FROM products WHERE id = ?", [item.product_id]);
              return {
                product: product[0],
                quantity: item.quantity
              };
            })
          );
  
          return {
            ...pedido,
            items: updatedItems
          };
        })
      );
  
      res.json(newResult);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
}

// * Funcion para obtener todos los pedidos del mes actual
export const getDatePedidos = async (req, res) => {
    try {
      const { done, date } = req.params;
        
      // Obtener la fecha desglosada del paramtro date
      const [year, month, day] = date.split("-");

      // Construir la consulta para traer los pedidos del mes y año específico
      let query = `SELECT * FROM orders WHERE YEAR(shippingDate) = ${year} AND MONTH(shippingDate) = ${month} AND DAY(shippingDate) = ${day}`;
  
      if (done === '1' || done === '0') {
        query += ` AND done = ${done}`;
      }
  
      query += " ORDER BY shippingDate ASC";
  
      const [result] = await pool.query(query);
  
      const newResult = await Promise.all(
        result.map(async (pedido) => {
          const [items] = await pool.query("SELECT * FROM orders_products WHERE order_id = ?", [pedido.id]);
  
          const updatedItems = await Promise.all(
            items.map(async (item) => {
              const [product] = await pool.query("SELECT * FROM products WHERE id = ?", [item.product_id]);
              return {
                product: product[0],
                quantity: item.quantity
              };
            })
          );
  
          return {
            ...pedido,
            items: updatedItems
          };
        })
      );
  
      res.json(newResult);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
}

// * Funcion para obtener todos los pedidos cuya direccion sea similar a la solicitada
// export const getPedidoAddress = async (req, res) => {
//     try {
//       const { address, done } = req.params;
  
//       // Construir la consulta para traer los pedidos con la dirección y estado específicos
//       let query = `SELECT * FROM orders WHERE address LIKE '%${address}%'`;
      
//       if (done === '1' || done === '0') {
//         query += ` AND done = '${done}'`;
//       }
  
//       query += " ORDER BY shippingDate ASC";
  
//       const [result] = await pool.query(query);
  
//       const newResult = await Promise.all(
//         result.map(async (pedido) => {
//           const [items] = await pool.query("SELECT * FROM orders_products WHERE order_id = ?", [pedido.id]);
  
//           const updatedItems = await Promise.all(
//             items.map(async (item) => {
//               const [product] = await pool.query("SELECT * FROM products WHERE id = ?", [item.product_id]);
//               return {
//                 product: product[0],
//                 quantity: item.quantity
//               };
//             })
//           );
  
//           return {
//             ...pedido,
//             items: updatedItems
//           };
//         })
//       );
  
//       res.json(newResult);
//     } catch (error) {
//       return res.status(500).json({ message: error.message });
//     }
//   }
  

// * Funcion para obtener un pedido mediante su id
export const getPedido = async (req, res) => {
    try {
        //res.send('Obteniendo un Pedido')
        const [result] = await pool.query("SELECT * FROM orders WHERE id = ?", [req.params.id]);
        // Devuelve un arreglo de un solo pedido (result[0]) que coincide con el ID solicitado 

        // Controlar que se devuelva un resultado de error si no existe el id solicitado
        if (result.length === 0) {
            return res.status(404).json({message: "Pedido not found"});
        };
        
        // Se traen todas las filas de la tabla orders_products que contienen el id del pedido
        const [itemsResult] = await pool.query("SELECT * FROM orders_products WHERE order_id = ?", [result[0].id]);

        // Ahora por cada elemento del arreglo de filas que se obtuvieron del SELECT a orders_products
        // hay que traer el producto correspondiente y armar el arreglo de items
        const pedidoItems = await Promise.all(
            itemsResult.map(async (item) => {
                const [product] = await pool.query("SELECT * FROM products WHERE id = ?", [item.product_id]);
                return {
                    product: product[0],
                    quantity: item.quantity
                };
            })
        );
        
        // Se le agrega al pedido su correspondiente listado de items
        result[0].items = pedidoItems;

        // Se devuelve el pedido
        res.json(result[0]);
    } catch (error) {
        // Retornar el mensaje de error como respuesta
        return res.status(500).json({message: error.message});
    }
}

// Funcion para eliminar un pedido mediante su id
export const deletePedido = async (req, res) => {
    try {
        console.log('Se eliminara el pedido con id: ', req.params.id);
        //res.send('Eliminando un pedido')
        /* 
        Aca, si bien no es necesario devolver un resultado luego de eliminar un pedido,
        Se utilizara el result.affectedRows para saber si el pedido que se desea eliminar
        realmente existe en la db, en el caso de no hacerlo se devolvera un msg de error
        */
        const [result] = await pool.query("DELETE FROM orders WHERE id = ?", [req.params.id]);
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
    try {
        //res.send('Modificando un pedido')

        // Como en el req.body se envian todos los campos de un pedido que corresponden a los de
        // la tabla orders pero ademas tambien el arreglo de items cuyos elementos corresponden a la tabla
        // orders_products, para hacer la consulta dinamica que ahorre escribir la consulta seteando
        // campo por campo, se guardan en una constante todos los campos del pedido excepto el arreglo de items
        // de esta manera se genera una consulta que actualice correctamente la tabla orders
        const fieldsToUpdate = Object.keys(req.body).filter(field => field !== 'items');
        const query = "UPDATE orders SET " + fieldsToUpdate.map(field => `${field}=?`).join(", ") + " WHERE id = ?";
        const values = [...fieldsToUpdate.map(field => req.body[field]), req.params.id];
        
        // Ejecuto el UPDATE de los datos del pedido en la tabla orders
        const result = await pool.query(query, values);
        // De la misma manera que al eliminar un pedido hay que controlar que exista,
        // lo mismo debe suceder al intentar modificarlo
        if (result.affectedRows === 0) {
            return res.status(404).json({message: "Pedido not found"});
        };

        // Como esta funcion de update sirve para actualizar todos los campos del pedido
        // como asi tambien para actualizar solamente el campo done que marca como entregado un pedido,
        // es necesario controlar las dos opciones. Si el req.body tiene solo un campo (done), significa
        // que se llamo la funcion solo para marcar el pedido como entregado, por lo que solo debera
        // actualizar ese campo en la fila correspondiente de la db. En el caso de que el body tenga mas
        // de un campo significa que se invoco para actualizar todos los campos del pedido como asi tambien
        // los productos que incluye, es por eso que se deben actualizar las filas correspondientes
        // de la tabla orders_products
        if (fieldsToUpdate.length > 1) {
            // Eliminar las filas de la tabla orders_products que coincidan con el id del pedido
            const deleteResult = await pool.query("DELETE FROM orders_products WHERE order_id = ?", [req.params.id]);
            // Control del resultado de la consulta
            if (deleteResult.affectedRows === 0) {
                return res.status(404).json({message: "Orders_products not found"});
            };

            
            // Extraigo el arreglo de items del req.body
            const { items } = req.body;
            // Insertar nuevas filas en la tabla orders_products correspondientes a los productos
            // y sus cantidades recorriendo el arreglo de items
            items.forEach(async (item) => {
                const { product, quantity } = item;
            
                // Insertar en la tabla "orders_products"
                await pool.query(
                    "INSERT INTO orders_products(order_id, product_id, quantity) VALUES (?, ?, ?)",
                    [req.params.id, product.id, quantity]
                );
            });
        }


        // En el caso de que todas las consultas correspondientes hayan resultado exitosas se indica
        // que el producto se actualizo correctamente pero no devuelve ningun resultado
        return res.sendStatus(204);
    } catch (error) {
        // Retornar el mensaje de error como respuesta
        return res.status(500).json({message: error.message});
    }
}



// **************** Funciones de utilidad **************** //

// Funcion para obtener la recaudacion de un mes en especifico
// Devuelve un arreglo con las recaudaciones de cada dia del mes
export const getMonthRevenue = async (req, res) => {
  try {
    const { monthYear } = req.params;

    // Obtener el mes y el año del parámetro monthYear
    const [year, month] = monthYear.split("-");

    // Obtener el último día del mes
    const lastDay = new Date(year, month, 0).getDate();

    // Construir la consulta para traer la suma del total de las ventas de cada día del mes y año específico
    let query = `SELECT DAY(shippingDate) AS day, SUM(total) AS dailyRevenue FROM orders WHERE YEAR(shippingDate) = ${year} AND MONTH(shippingDate) = ${month} AND done = 1 GROUP BY DAY(shippingDate)`;

    const [result] = await pool.query(query);

    const monthRevenue = Array(lastDay).fill(0); // Crear un arreglo con la longitud del mes, inicializado en 0

    result.forEach((row) => {
      const day = row.day;
      const dailyRevenue = row.dailyRevenue;
      monthRevenue[day - 1] = dailyRevenue; // Asignar la recaudación diaria al arreglo correspondiente
    });

    res.json({ monthRevenue });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Funcion para obtener la recaudacion de un año en especifico
// Devuelve un arreglo con las recaudaciones de cada mes del año
export const getYearRevenue = async (req, res) => {
  try {
    const { year } = req.params;

    // Construir la consulta para traer la suma del total de las ventas de cada mes de un año específico
    let query = `SELECT MONTH(shippingDate) AS month, SUM(total) AS totalRevenue FROM orders WHERE YEAR(shippingDate) = ${year} AND done = 1 GROUP BY MONTH(shippingDate)`;

    const [result] = await pool.query(query);

    const yearRevenue = Array(12).fill(0); // Crear un arreglo de 12 elementos inicializado en 0

    result.forEach((row) => {
      const month = row.month - 1; // Restar 1 para ajustar al índice del arreglo
      const totalRevenue = row.totalRevenue;
      yearRevenue[month] = totalRevenue; // Asignar la suma del mes al arreglo correspondiente
    });

    res.json({ yearRevenue });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Funcion para obtener la cantidad de ventas de un mes en especifico
export const getMonthlySalesAmount = async (req, res) => {
  try {
    // Obtener el mes y el año del parámetro monthYear
    const { monthYear } = req.params;
    const [year, month] = monthYear.split("-");

    // Construir la consulta para obtener la cantidad de ventas del mes y año específico
    const query = `
      SELECT COUNT(*) as salesAmount
      FROM orders
      WHERE YEAR(shippingDate) = ? AND MONTH(shippingDate) = ? AND done = 1
    `;
    
    const [result] = await pool.query(query, [year, month]);

    const salesAmount = result[0].salesAmount;
    
    res.json({ salesAmount });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Función para obtener la cantidad de ventas de un año específico
export const getYearlySalesAmount = async (req, res) => {
  try {
    // Obtener el año del parámetro
    const { year } = req.params;

    // Construir la consulta para obtener la cantidad de ventas del año específico
    const query = `
      SELECT COUNT(*) as salesAmount
      FROM orders
      WHERE YEAR(shippingDate) = ? AND done = 1
    `;

    const [result] = await pool.query(query, [year]);

    const salesAmount = result[0].salesAmount;

    res.json({ salesAmount });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Funcion para obtener el producto mas vendido de un mes en especifico
export const getMonthlyBestSellingProduct = async (req, res) => {
  try {
    // Obtener el mes y el año del parámetro monthYear
    const { monthYear } = req.params;
    const [year, month] = monthYear.split("-");

    // Construir la consulta para obtener el producto más vendido del mes y año específico
    const query = `
      SELECT p.id, p.productName, p.imgURL, p.imgPublic_id, p.description, p.price, SUM(op.quantity) AS totalQuantity
      FROM products p
      INNER JOIN orders_products op ON p.id = op.product_id
      INNER JOIN orders o ON op.order_id = o.id
      WHERE YEAR(o.shippingDate) = ? AND MONTH(o.shippingDate) = ? AND o.done = 1
      GROUP BY p.id
      ORDER BY totalQuantity DESC
      LIMIT 1
    `;

    const [result] = await pool.query(query, [year, month]);

    const bestSellingProduct = result[0];

    res.json({ bestSellingProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving best-selling product" });
  }
};

// Funcion para obtener el producto mas vendido de un año en especifico
export const getYearlyBestSellingProduct = async (req, res) => {
  try {
    const { year } = req.params;

    const query = `
      SELECT p.id, p.productName, p.imgURL, p.imgPublic_id, p.description, p.price, SUM(op.quantity) AS totalQuantity
      FROM products p
      INNER JOIN orders_products op ON p.id = op.product_id
      INNER JOIN orders o ON op.order_id = o.id
      WHERE YEAR(o.shippingDate) = ? AND o.done = 1
      GROUP BY p.id
      ORDER BY totalQuantity DESC
      LIMIT 1
    `;

    const [result] = await pool.query(query, [year]);
    const bestSellingProduct = result[0];

    console.log(bestSellingProduct);

    res.json({ bestSellingProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving best-selling product" });
  }
};


