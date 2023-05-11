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

// * Funcion para obtener todas los pedidos de la db
export const getPedidos = async (req, res) => {
    try {
        //res.send('Obteniendo Pedidos')
        const [result] = await pool.query("SELECT * FROM orders ORDER BY createAt DESC");
        // Devuelve un arreglo con todas los pedidos

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
        // Los datos de los campos a modificar se obtienen del req.body
        const {title, description, done, shippingDate, withdrawOrSend, address, client, deliveryCost, total, payment, items} = req.body;
        
        // Ejecuto el UPDATE de los datos del pedido en la tabla orders
        const result = await pool.query("UPDATE orders SET title=?, description=?, done=?, shippingDate=?, withdrawOrSend=?, address=?, client=?, deliveryCost=?, total=?, payment=? WHERE id = ?", [title, description, done, shippingDate, withdrawOrSend, address, client, deliveryCost, total, payment, req.params.id]);
        // De la misma manera que al eliminar un pedido hay que controlar que exista,
        // lo mismo debe suceder al intentar modificarlo
        if (result.affectedRows === 0) {
            return res.status(404).json({message: "Pedido not found"});
        };

        // Eliminar las filas de la tabla orders_products que coincidan con el id del pedido
        const deleteResult = await pool.query("DELETE FROM orders_products WHERE order_id = ?", [req.params.id]);
        // Control del resultado de la consulta
        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({message: "Orders_products not found"});
        };

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

        // En el caso de que todas las consultas hayan resultado exitosas se indica
        // que el producto se actualizo correctamente pero no devuelve ningun resultado
        return res.sendStatus(204);
    } catch (error) {
        // Retornar el mensaje de error como respuesta
        return res.status(500).json({message: error.message});
    }

}