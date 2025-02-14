'use estrict'

import express from 'express' //SERVIDOR HTTP
import morgan from 'morgan' //LOGS
import helmet from 'helmet' //SEGURIDAD HTTP
import cors from 'cors' //ACCESO AL API
import administratorRoutes from '../src/administrator/administrator.routes.js'
import categoryRoutes from '../src/administrator/category/category.routes.js'
import loginRoutes from '../src/auth/auth.routes.js'

const configs = (app)=>{
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
    app.use(cors())
    app.use(helmet())
    app.use(morgan('dev'))    
}


const routes = (app)=>{
    app.use('/v1/administrator', administratorRoutes)
    app.use('/v1/category', categoryRoutes)
    app.use('/v1/login', loginRoutes)
}
 

//ES NO ACEPTA EXPORTS CON .
export const initServer = async()=>{
    const app = express() //INSTANCIA DE EXPRESS
    try{
        configs(app) //APLICAR CONFIGURACIONES DEL SERVIDOR 
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running in port ${process.env.PORT}`)
    }catch(err){
        console.error('Server init failed', err)
    }
}




