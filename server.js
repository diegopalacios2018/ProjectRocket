const express = require('express');
const path = require('path');
const mysql = require('mysql2'); // Reemplaza mongoose con mysql2
const sequelize = require('./config/database'); // Importar la configuración de la base de datos
const bodyParser = require('body-parser'); // Middleware para analizar el cuerpo de las solicitudes HTTP
const User = require('./models/user'); // Importar el modelo de usuario
require('dotenv').config();
const ejs = require('ejs');

const app = express();
const PORT = process.env.PORT || 3000;

// Verificar la conexión
sequelize.authenticate()
    .then(() => {
        console.log('Connected to MySQL with Sequelize!');
    })
    .catch(err => {
        console.error('Unable to connect to MySQL:', err.message);
    });

// Sincronizar el modelo de usuario con la base de datos (crea la tabla si no existe)
User.sync();

    // Configuración del motor de vistas
app.set('view engine', 'ejs');
app.set('views', './views'); 

// Middleware para servir archivos estáticos y analizar datos del formulario
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false })); // Analiza los datos del formulario
app.use(bodyParser.json()); // Para datos enviados en formato JSON, como en pruebas desde Postman

async function getUserById(userId) {
    try {
        return await User.findByPk(userId); // Busca el usuario por su ID
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        return null; // Manejo de errores
    }
}

async function deleteUserById(userId) {
    try {
        const user = await User.findByPk(userId);
        if (user) {
            await user.destroy(); // Elimina el usuario
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

//Indicacion a la base de datos modificacion
async function updateUserById(id, updatedUser) {
    try {
        const result = await User.findByIdAndUpdate(id, updatedUser, { new: true });
        return result;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

// Rutas
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' }); // Renderiza la página de inicio
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' }); // Renderiza la página "About Us"
});

app.post('/add-user', async (req, res) => {
    const { name, email, address } = req.body; // Obtener los datos del formulario

    if (!name || !email) {
        return res.status(400).send('Name and email are required'); // Validación simple para evitar datos faltantes
    }

    try {
        const newUser = await User.create({ name, email, address }); // Crear y guardar un nuevo usuario
        //res.status(201).send('User added successfully');
        const users = await User.findAll(); // Obtener todos los usuarios
        res.render('read', { users });
    } catch (err) {
        console.error('Error adding user:', err.message);
        res.status(400).send('Error adding user');
    }
});

// Ruta para obtener la lista de usuarios
app.get('/read', async (req, res) => {
    try {
    const users = await User.findAll(); // Obtener todos los usuarios
    res.render('read', { users });
} catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error'); // Manejo de errores
}
});

// Ruta para editar un usuario
app.get('/edit-user/:id', (req, res) => {
    const userId = req.params.id;
    const user = getUserById(userId); // Implementa esta función según tu lógica
    res.render('edit', { user }); // Renderiza una página de edición
});

// Ruta para eliminar un usuario
app.post('/delete-user/:id', (req, res) => {
    const userId = req.params.id;
    deleteUserById(userId); // Implementa esta función según tu lógica
    const users =  User.findAll(); // Obtener todos los usuarios
    res.render('read', { users });
});

//Indicacion de modificacion
app.post('/update-user/:id', (req, res) => {
    const userId = req.params.id;
    const updatedUser = {
        name: req.body.name,
        email: req.body.email,
        address: req.body.address
    };
    updateUserById(userId, updatedUser); // Función que actualiza el usuario en tu base de datos
    res.redirect('/read'); // Redirige a la lista de usuarios después de la actualización
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
