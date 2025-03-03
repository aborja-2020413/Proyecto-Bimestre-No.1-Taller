
import {Router} from 'express'
import { addProduct, getAllProducts, getProductById, editProduct, deleteProduct, getOutOfStockProducts, getTopSellers, 
    UserRegister, /*AdministratorRegister*/ updateUserRole, updateUser, deleteUser } from './administrator.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()

// Ruta para agregar un nuevo producto
api.post('/addproducts', [validateJwt], addProduct);

// Ruta para obtener todos los productos
api.get('/products', [validateJwt] ,getAllProducts);

// Ruta para obtener un producto por ID
api.get('/products/:id', [validateJwt], getProductById);

// Ruta para editar un producto
api.put('/products/:id', [validateJwt], editProduct);

// Ruta para eliminar un producto
api.delete('/products/:id', [validateJwt], deleteProduct);

// Ruta para obtener productos agotados
api.get('/products/status/out-of-stock', [validateJwt], getOutOfStockProducts);

// Ruta para obtener productos más vendidos
api.get('/products/status/top-sellers', [validateJwt], getTopSellers);

/*GESTION DE USUARIOS*/
api.post('/addClient', [validateJwt], UserRegister);
api.put('/editRole/:id', [validateJwt], updateUserRole);
// Ruta para actualizar un cliente (solo administradores pueden editar clientes)
api.put('/editClient/:id', [validateJwt], updateUser);
// Ruta para eliminar un usuario (solo administradores pueden eliminar clientes o administradores)
api.delete('/deleteClient/:id', [validateJwt], deleteUser);
/*GESTION DE USUARIOS*/

export default api;