

import {Router} from 'express'
import { addCategory, getAllCategories, updateCategory, deleteCategory } from './category.controller.js'

const api = Router()

/*rutas para las categorias*/

// Ruta para agregar una nueva categoría
api.post('/addcategories', addCategory);

// Ruta para obtener todas las categorías
api.get('/allcategories', getAllCategories);

// Ruta para editar una categoría
api.put('/editcategories/:id', updateCategory);

// Ruta para eliminar una categoría
api.delete('/deletecategories/:id', deleteCategory);

export default api;