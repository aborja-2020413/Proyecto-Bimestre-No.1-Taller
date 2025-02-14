
import {Router} from 'express'
import {addProduct, getAllProducts, getProductById, editProduct, deleteProduct, getOutOfStockProducts, getTopSellers} from './administrator.controller.js'

//import { validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()

// Ruta para agregar un nuevo producto
api.post('/addproducts', addProduct);

// Ruta para obtener todos los productos
api.get('/products', getAllProducts);

// Ruta para obtener un producto por ID
api.get('/products/:id', getProductById);

// Ruta para editar un producto
api.put('/products/:id', editProduct);

// Ruta para eliminar un producto
api.delete('/products/:id', deleteProduct);

// Ruta para obtener productos agotados
api.get('/products/status/out-of-stock', getOutOfStockProducts);

// Ruta para obtener productos más vendidos
api.get('/products/status/top-sellers', getTopSellers);


export default api;