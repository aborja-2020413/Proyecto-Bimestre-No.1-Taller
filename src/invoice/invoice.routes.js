import {Router} from 'express'
import { createInvoice, updateInvoice, getUserInvoices,  getInvoiceDetails, getPurchaseHistory } from './invoice.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'


const api = Router()


// Crear una nueva factura
api.post('/createInvoice', [validateJwt], createInvoice);

// Editar una factura existente
api.put('/updateInvoice/:id', [validateJwt], updateInvoice);

// Obtener las facturas de un usuario específico
api.get('/findInvoice/:userId', [validateJwt], getUserInvoices);

// Obtener los detalles de una factura específica
api.get('/detailsInvoice/:id', [validateJwt], getInvoiceDetails);

api.get('/history/:user', [validateJwt], getPurchaseHistory); // Ruta para ver historial de compras

export default api;


