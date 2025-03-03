import {Router} from 'express'

import { addProductToCart, getCart,  removeProductFromCart, checkout } from './shoppingCart.controller.js';

const api = Router()

// Ruta para agregar un producto al carrito
api.post('/addCart', addProductToCart);

// Ruta para obtener el carrito de un usuario
api.get('/searchCart/:userId', getCart);

// Ruta para eliminar un producto del carrito
api.delete('/removeCart', removeProductFromCart);

// Ruta para el proceso de compra
api.post('/checkout', checkout);

/*
// Ruta para actualizar la cantidad de un producto en el carrito
api.put('/update-quantity', updateProductQuantity);
*/

/*
// Ruta para vaciar el carrito de un usuario
api.delete('/clear', clearCart);
*/

export default api;