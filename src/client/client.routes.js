import {Router} from 'express'
import { getAllProducts, getTopSellers, searchProducts, filterByCategory, updateUserProfile, deleteUserAccount } from './client.controller.js';
import { validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()

api.get('/allproducts', [validateJwt], getAllProducts); // Ver todos los productos
api.get('/products/top-sellers',[validateJwt],  getTopSellers); // Ver productos más vendidos
api.get('/searchProduct', [validateJwt], searchProducts); // Buscar productos por nombre
api.get('/searchProducts/:category', [validateJwt], filterByCategory); // Filtrar productos por categoría

api.put('/editProfile/:user', [validateJwt], updateUserProfile); // Ruta para actualizar perfil
api.delete('/deleteProfile/:user', [validateJwt], deleteUserAccount); // Ruta para eliminar la cuenta

export default api;
