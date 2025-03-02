

import {Router} from 'express'
import { addCategory, getAllCategories, updateCategory, deleteCategory } from './category.controller.js'
import { validateJwt } from '../../../middlewares/validate.jwt.js'

const api = Router()

/*rutas para las categorias*/

// Ruta para agregar una nueva categoría
api.post('/addcategories', [validateJwt], addCategory);

// Ruta para obtener todas las categorías
api.get('/allcategories', [validateJwt], getAllCategories);

// Ruta para editar una categoría
api.put('/editcategories/:id', [validateJwt], updateCategory);

// Ruta para eliminar una categoría
api.delete('/deletecategories/:id', [validateJwt], deleteCategory);

export default api;