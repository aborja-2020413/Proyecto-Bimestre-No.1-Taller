
import { checkPassword, encrypt } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'
import Client from '../client/client.model.js'
import Invoice from '../Invoice/invoice.model.js'

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
 
// Login  
export const login = async (req, res) => {
    try {
        let { username, password } = req.body;
        let user = await Client.findOne({ username });

        if (user && await checkPassword(user.password, password)) {
            
            let loggedUser = {
                uid: user._id,
                name: user.name,
                username: user.username,
                role: user.role
            };

            let token = await generateJwt(loggedUser);

            // Obtener el historial de compras del usuario
            const HistorialDeCompras = await Invoice.find({ user: user._id }).populate('products');

            return res.send({
                message: `Welcome ${user.name}`,
                loggedUser,
                token,
                HistorialDeCompras
            });
        }
        return res.status(400).send({ message: 'Correo electrónico o contraseña incorrectos' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'General error in login function' });
    }
};