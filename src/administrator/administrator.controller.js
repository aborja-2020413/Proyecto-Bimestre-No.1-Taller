import Product from '../product/product.model.js';
import { encrypt } from '../../utils/encrypt.js'
import Client from '../client/client.model.js'
import Administrator from './administrator.model.js'
import argon2 from 'argon2';
import Category from './category/category.model.js'

// Agregar un nuevo producto
export const addProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los productos
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Editar un producto
export const editProduct = async (req, res) => {
    try {
        // Validar que la categoría existe
        if (req.body.category) {
            const categoryExists = await Category.findById(req.body.category);
            if (!categoryExists) {
                return res.status(404).json({ message: 'Categoría no encontrada' });
            }
        }

        // Editar el producto
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener productos agotados
export const getOutOfStockProducts = async (req, res) => {
    try {
        const products = await Product.find({ stock: 0 });
        
        // Verificar si hay productos agotados
        if (products.length === 0) {
            return res.status(404).json({ mensaje: 'No hay productos agotados' });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener productos más vendidos
export const getTopSellers = async (req, res) => {
    try {
        const products = await Product.find().sort({ sales: -1 }).limit(10);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* GESTION DE USUARIOS */
export const UserRegister = async(req, res)=>{
    try{
        //Capturar los datos
        let data = req.body
        //Aquí van validaciones
        let user = new Client(data)

        //Encriptar la password
        user.password = await encrypt(user.password)
        //Guardar
        await user.save()
        //Responder al usuario
        return res.send({message: `Registered successfully, can be logged with username: ${user.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'General error with registering user', err})
    }
}

// Modificar el rol de un usuario (solo admin)
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const { id } = req.params;
        
        if (!['ADMIN', 'CLIENT'].includes(role)) {
            return res.status(400).json({ mensaje: 'Rol inválido' });
        }
        
        const usuario = await Client.findByIdAndUpdate(id, { role }, { new: true });
        
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        
        res.status(200).json({ mensaje: 'Rol actualizado', usuario });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Editar información de usuario 
export const updateUser = async (req, res) => {
    try {
        const { adminId, name, surname, username, email, password } = req.body;
        const { id } = req.params; // ID del usuario que se quiere editar

        // Verificar que el administrador que hace la petición existe
        const administrador = await Administrator.findById(adminId);
        
        if (!administrador) {
            return res.status(404).json({ mensaje: 'Administrador no encontrado' });
        }

        // Validar que el usuario que hace la edición sea un ADMIN
        if (administrador.role !== 'ADMIN') {
            return res.status(403).json({ mensaje: 'No tienes permiso para editar usuarios' });
        }

        // Buscar al usuario que se desea editar (solo en la colección de clientes)
        const usuario = await Client.findById(id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Cliente a editar no encontrado' });
        }

        // Actualizar los campos si son proporcionados en la solicitud
        if (name) usuario.name = name;
        if (surname) usuario.surname = surname;
        if (username) usuario.username = username;
        if (email) usuario.email = email;

        // Si se proporciona una nueva contraseña, encriptarla con Argon2
        if (password) {
            usuario.password = await argon2.hash(password);
        }

        // Guardar los cambios en la base de datos
        await usuario.save();

        res.status(200).json({ mensaje: 'Cliente actualizado correctamente', usuario });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/*
// Eliminar usuario (solo administradores pueden eliminar a otros administradores, clientes solo pueden eliminarse a sí mismos)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params; // ID del usuario a eliminar (enviado en la ruta)
        const { userId } = req.body; // ID del usuario que realiza la solicitud (enviado en el body)

        // Buscar al usuario solicitante (puede ser Admin o Client)
        const usuarioSolicitante = await Administrator.findById(userId) || await Client.findById(userId);
        if (!usuarioSolicitante) {
            return res.status(404).json({ mensaje: 'Usuario solicitante no encontrado' });
        }

        // Buscar al usuario a eliminar (puede ser Admin o Client)
        let usuario = await Administrator.findById(id) || await Client.findById(id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario a eliminar no encontrado' });
        }

        // Validación de permisos:
        // Si el usuario solicitante es un cliente, no puede eliminar a nadie
        if (usuarioSolicitante.role === 'CLIENT') {
            return res.status(403).json({ mensaje: 'Los clientes no tienen permiso para eliminar usuarios' });
        }

        // El administrador puede eliminar a un cliente o a otro administrador
        // No se necesita más validación porque un ADMIN puede eliminar tanto a un CLIENT como a un ADMIN

        // Eliminar usuario del modelo correspondiente
        if (usuario.role === 'ADMIN') {
            await Administrator.findByIdAndDelete(id);
        } else {
            await Client.findByIdAndDelete(id);
        }

        res.status(200).json({ mensaje: 'Cliente o Administrador eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
*/

// Dar de baja a un usuario (solo administradores pueden dar de baja a otros administradores, clientes solo pueden darse de baja a sí mismos)
export const deactivateUser = async (req, res) => {
    try {
        const { id } = req.params; // ID del usuario a dar de baja (enviado en la ruta)
        const { userId } = req.body; // ID del usuario que realiza la solicitud (enviado en el body)

        // Buscar al usuario solicitante (puede ser Admin o Client)
        const usuarioSolicitante = await Administrator.findById(userId) || await Client.findById(userId);
        if (!usuarioSolicitante) {
            return res.status(404).json({ mensaje: 'Usuario solicitante no encontrado' });
        }

        // Buscar al usuario a dar de baja (puede ser Admin o Client)
        let usuario = await Administrator.findById(id) || await Client.findById(id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Validación de permisos:
        // Si el usuario solicitante es un cliente, solo puede darse de baja a sí mismo
        if (usuarioSolicitante.role === 'CLIENT' && usuarioSolicitante.id !== id) {
            return res.status(403).json({ mensaje: 'Los clientes solo pueden darse de baja a sí mismos' });
        }

        // Cambiar el status del usuario a false en el modelo correspondiente
        usuario.status = false;
        await usuario.save();

        res.status(200).json({ mensaje: 'Usuario dado de baja exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
















/* GESTION DE USUARIOS */