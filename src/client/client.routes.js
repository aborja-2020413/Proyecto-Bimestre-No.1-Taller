import {Router} from 'express'
import { getAllProducts, getTopSellers, searchProducts, filterByCategory} from './client.controller.js';
import { validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()

api.get('/allproducts', [validateJwt], getAllProducts); // Ver todos los productos
api.get('/products/top-sellers',[validateJwt],  getTopSellers); // Ver productos más vendidos
api.get('/searchProduct', [validateJwt], searchProducts); // Buscar productos por nombre
api.get('/searchProducts/:category', [validateJwt], filterByCategory); // Filtrar productos por categoría


export default api;
