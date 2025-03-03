
import { checkPassword, encrypt } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'
import Client from '../client/client.model.js'


//Register
export const register = async(req, res)=>{
    try{
        //Capturar los datos
        let data = req.body
        //Aquí van validaciones
        let user = new Client(data)

        //Encriptar la password
        user.password = await encrypt(user.password)
        //Guardar
        await user.save()
        //Responder al usuario
        return res.send({message: `Registered successfully, can be logged with username: ${user.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'General error with registering user', err})
    }
}
 
//Login
export const login = async (req, res)=>{
    try{
        let {username, password}  = req.body
        let user = await Client.findOne({username})
        if(user && await checkPassword(user.password, password)){
            
            let loggedUser = {
                uid: user._id,
                name: user.name,
                username: user.username,
                role: user.role
            }

            let token = await generateJwt(loggedUser)
            
            return res.send({message: `Welcome ${user.name}`, loggedUser, token})
        }
        return res.status(400).send({message: 'Wrong email or password'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'General error white login fuction'})
    }
}