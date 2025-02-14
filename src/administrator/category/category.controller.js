import Category from './category.model.js';
import Product from '../../product/product.model.js'

/* FUNCIONALIDADES PARA LA CATEGORIA */
//Agregar una nueva categoría
export const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Verificar si la categoría ya existe
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = new Category({ name, description });
        await category.save();
        res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


//Obtener todas las categorías
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Editar una categoría
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const category = await Category.findByIdAndUpdate(
            id,
            { name, description },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


export const deleteCategory = async (req, res) => {  
    try {
        const { id } = req.params;

        // Buscar la categoría a eliminar
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Buscar la categoría predeterminada (ejemplo: "General")
        const defaultCategory = await Category.findOne({ name: 'general' });
        if (!defaultCategory) {
            return res.status(400).json({ message: 'Default category not found' });
        }

        // Actualizar productos que pertenecían a la categoría eliminada
        await Product.updateMany(
            { category: category._id },  // ✅ Filtramos por el ID de la categoría
            { $set: { category: defaultCategory._id } }  // ✅ Asignamos el ID de la categoría "General"
        );

        // Eliminar la categoría
        await Category.findByIdAndDelete(id);

        res.status(200).json({ message: 'Category deleted and products reassigned successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

