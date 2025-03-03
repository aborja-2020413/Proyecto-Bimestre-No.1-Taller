import Product from '../product/product.model.js'

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