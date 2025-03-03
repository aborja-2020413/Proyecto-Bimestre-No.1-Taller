import Product from '../product/product.model.js'
import Client from './client.model.js'

// Ver todos los productos
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find(); // Obtener todos los productos
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Ver los productos más vendidos
export const getTopSellers = async (req, res) => {
    try {
        const topProducts = await Product.find().sort({ sales: -1 }).limit(10); // Obtener los productos más vendidos
        res.status(200).json(topProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Buscar productos por nombre
export const searchProducts = async (req, res) => {
    const { Name } = req.body; // Obtiene el parámetro de búsqueda desde el cuerpo de la solicitud
    try {
        // Buscar productos que coincidan con el nombre usando una expresión regular insensible a mayúsculas
        const products = await Product.find({ name: { $regex: Name, $options: 'i' } });
        
        // Validar si no se encontraron productos
        if (products.length === 0) {
            return res.status(404).json({ mensaje: 'No hay productos con ese nombre' });
        }
        
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Filtrar productos por categoría
export const filterByCategory = async (req, res) => {
    const { category } = req.params; // Obtiene la categoría del parámetro de la URL
    try {
        // Verificar si la categoría está vacía
        if (!category) {
            return res.status(400).json({ mensaje: 'La categoría es requerida' });
        }

        // Filtrar productos por categoría
        const products = await Product.find({ category: category });

        // Validar si no hay productos en la categoría
        if (products.length === 0) {
            return res.status(404).json({ mensaje: 'No hay productos en esta categoría' });
        }

        // Si se encuentran productos, devolverlos
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
/*
// Ver los productos detallados en una factura
export const getInvoiceDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const invoice = await Invoice.findById(id).populate('products');
        if (!invoice) {
            return res.status(404).json({ mensaje: 'Factura no encontrada' });
        }

        res.status(200).json(invoice);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
*/


/*GESTION DE PERFIL*/
// Editar perfil de usuario
export const updateUserProfile = async (req, res) => {
    try {
        const { user } = req.params; // ID del usuario desde los parámetros
        const { name, surname, username , email } = req.body; // Datos a actualizar

        // Verificar si el usuario existe
        const existingUser = await Client.findById(user);
        if (!existingUser) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Verificar si el email o username ya están en uso por otro usuario
        if (email && email !== existingUser.email) {
            const emailExists = await Client.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ mensaje: 'El correo electrónico ya está en uso' });
            }
        }

        if (username && username !== existingUser.username) {
            const usernameExists = await Client.findOne({ username });
            if (usernameExists) {
                return res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });
            }
        }

        // Actualizar la información del usuario
        existingUser.name = name || existingUser.name;
        existingUser.surname = surname || existingUser.surname;
        existingUser.username = username || existingUser.username;
        existingUser.email = email || existingUser.email;

        await existingUser.save(); // Guardar los cambios

        res.status(200).json({ mensaje: 'Perfil actualizado con éxito', user: existingUser });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar cuenta de usuario
export const deleteUserAccount = async (req, res) => {
    try {
        const { user } = req.params; // ID del usuario desde los parámetros
        const { confirmation } = req.body; // Confirmación de eliminación

        // Verificar si el usuario existe
        const existingUser = await Client.findById(user);
        if (!existingUser) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Verificar confirmación
        if (!confirmation || confirmation !== 'CONFIRM') {
            return res.status(400).json({ mensaje: 'Se requiere confirmación para eliminar la cuenta' });
        }

        // Eliminar la cuenta del usuario
        await Client.findByIdAndDelete(user);

        res.status(200).json({ mensaje: 'Cuenta eliminada con éxito' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/*GESTION DE PERFIL*/