-- Se sigue lo de la prueba

CREATE DATABASE bancosolar;

CREATE TABLE usuarios (id SERIAL PRIMARY KEY, nombre VARCHAR(50),
balance FLOAT CHECK (balance >= 0));

CREATE TABLE transferencias (id SERIAL PRIMARY KEY, emisor INT, receptor
INT, monto FLOAT, fecha TIMESTAMP, FOREIGN KEY (emisor) REFERENCES
usuarios(id), FOREIGN KEY (receptor) REFERENCES usuarios(id));

------------

-- Ahora alteramos tabla y agregamos columna estado con datatype boolean y que por default venga true cada vez que agregamos un usuario

alter table usuarios add column estado BOOLEAN not null DEFAULT true;