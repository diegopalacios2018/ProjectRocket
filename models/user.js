const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importar la configuración de la base de datos

// Definir el modelo de usuario
const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
         
    }
}, {
    timestamps: false, // Deshabilitar las marcas de tiempo automáticas (createdAt, updatedAt)
    tableName: 'users' // Opcional: especificar el nombre de la tabla en la base de datos
});

module.exports = User;

