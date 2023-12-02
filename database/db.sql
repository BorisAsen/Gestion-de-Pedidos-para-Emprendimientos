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
    createAt DATETIME NOT NULL DEFAULT NOW(),
    updatedAt DATETIME NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    doneAt DATETIME,
    withdrawOrSend BOOLEAN NOT NULL DEFAULT 0, -- 1 Envio, 0 Retira
    address VARCHAR(200),
    client VARCHAR(100),
    deliveryCost DOUBLE DEFAULT 0,
    total DOUBLE NOT NULL DEFAULT 0,
    payment ENUM('Efectivo', 'Transferencia', 'Tarjeta') NOT NULL DEFAULT 'Efectivo',
    shippingDate DATETIME NOT NULL DEFAULT NOW()
);

-- Tabla de Productos
CREATE TABLE products(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    productName VARCHAR(200) NOT NULL,
    imgURL VARCHAR(1000),
    imgPublic_id VARCHAR(1000),
    description VARCHAR(700),
    price DOUBLE NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT NOW(),
    updatedAt DATETIME NOT NULL DEFAULT NOW(),
    active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tabla de relacion entre Pedidos y Productos
CREATE TABLE orders_products(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);