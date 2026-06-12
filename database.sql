CREATE DATABASE IF NOT EXISTS inventario CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE inventario;

DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS cajas;
DROP TABLE IF EXISTS estantes;
DROP TABLE IF EXISTS espacios;

CREATE TABLE espacios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE estantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion VARCHAR(255),
  espacio_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (espacio_id) REFERENCES espacios(id) ON DELETE CASCADE
);

CREATE TABLE cajas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion VARCHAR(255),
  espacio_id INT,
  estante_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (espacio_id) REFERENCES espacios(id) ON DELETE SET NULL,
  FOREIGN KEY (estante_id) REFERENCES estantes(id) ON DELETE SET NULL
);

CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion VARCHAR(255),
  cantidad INT DEFAULT 1,
  espacio_id INT,
  estante_id INT,
  caja_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (espacio_id) REFERENCES espacios(id) ON DELETE SET NULL,
  FOREIGN KEY (estante_id) REFERENCES estantes(id) ON DELETE SET NULL,
  FOREIGN KEY (caja_id) REFERENCES cajas(id) ON DELETE SET NULL
);

-- Datos de prueba
INSERT INTO espacios (nombre, descripcion) VALUES
  ('Taller', 'Taller principal de trabajo'),
  ('Pañol', 'Depósito de herramientas y materiales'),
  ('Contenedor', 'Contenedor de almacenamiento exterior');

INSERT INTO estantes (nombre, descripcion, espacio_id) VALUES
  ('Estante A', 'Herramientas manuales', 1),
  ('Estante B', 'Repuestos eléctricos', 1),
  ('Mueble 1', 'Materiales de plomería', 2),
  ('Mueble 2', 'Pinturas y solventes', 2);

INSERT INTO cajas (nombre, descripcion, espacio_id, estante_id) VALUES
  ('Caja de herramientas', 'Llaves y destornilladores', 1, 1),
  ('Caja eléctrica', 'Cables y conectores', 1, 2),
  ('Caja tornillería', 'Tornillos, tuercas y arandelas', 2, 3);

INSERT INTO items (nombre, descripcion, cantidad, espacio_id, estante_id, caja_id) VALUES
  ('Llave 10mm', NULL, 2, 1, 1, 1),
  ('Destornillador plano', NULL, 3, 1, 1, 1),
  ('Cable 2.5mm x 5m', NULL, 1, 1, 2, 2),
  ('Disyuntor 20A', NULL, 4, 1, 2, 2),
  ('Tornillos 6x30', '100 unidades', 1, 2, 3, 3),
  ('Caño galvanizado 1/2"', '2 metros', 3, 2, 3, NULL),
  ('Pintura blanca 4L', NULL, 2, 2, 4, NULL),
  ('Amoladora', 'Bosch 750W', 1, 1, NULL, NULL);
