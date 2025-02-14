import Product from '../product/product.model.js';

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
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
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



