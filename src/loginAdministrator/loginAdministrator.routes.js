
import { Router} from 'express'
import { AdministratorRegister, login} from './loginAdministrator.controller.js'
//import { validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()

//RUTAS PUBLICAS
api.post('/addAdmin', AdministratorRegister)

api.post('/login', login)

//EXPORTAR
export default api