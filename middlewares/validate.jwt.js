'use strict'

import jwt from 'jsonwebtoken'

export const validateJwt = async(req, res, next)=>{
    try{
        //obtener la llave de acceso al token
        let secretKey = process.env.SECRET_KEY
        //obtener el token de los headers
        let { authorization } = req.headers

        if(!authorization) return res.status(401).send({message: 'UnauThorized'})

        let user = jwt.verify(authorization, secretKey)

        req.user = user 

        next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message: 'Invalidate token'})
    }
}

