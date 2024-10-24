const { Sequelize } = require('sequelize');
require('dotenv').config(); //Cargar variables de entorno

// Configurar Sequelize para conectarse a la base de datos MySQL
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    }
);

module.exports = sequelize;

