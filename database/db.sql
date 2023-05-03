-- Tabla de Tareas
-- CREATE TABLE tasks(
--     id INTEGER PRIMARY KEY AUTO_INCREMENT,
--     title VARCHAR(200) NOT NULL,
--     description VARCHAR(300),
--     done BOOLEAN NOT NULL DEFAULT 0,
--     createAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );

-- Tabla de Pedidos
CREATE TABLE orders(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(300) NOT NULL,
    description VARCHAR(300),
    done BOOLEAN NOT NULL DEFAULT 0,
    createAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    doneAt TIMESTAMP,
    withdrawOrSend BOOLEAN NOT NULL DEFAULT 0,
    address VARCHAR(200),
    client VARCHAR(100),
    deliveryCost DOUBLE DEFAULT 0,
    total DOUBLE NOT NULL DEFAULT 0,
);

-- Tabla de Productos
CREATE TABLE products(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    productName VARCHAR(200) NOT NULL,
    imgURL VARCHAR(1000),
    imgPublic_id VARCHAR(1000),
    description VARCHAR(700),
    price DOUBLE NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de relacion entre Pedidos y Productos
CREATE TABLE orders_products(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);