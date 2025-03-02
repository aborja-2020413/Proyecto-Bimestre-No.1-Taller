
import { Router} from 'express'
import { login, register} from './auth.controller.js'
//import { validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()

//RUTAS PUBLICAS
api.post('/register', register)

api.post('/addlogin', login)

//EXPORTAR
export default api