import {Schema, model} from 'mongoose'

const clientSchema = Schema (
    {
        name:{
            type: String,
            required: [true, 'Name is required']
        },
        surname:{
            type: String,
            required: [true, 'Surname is required']
        },
        username:{
            type: String,
            required: [true, 'Username is required'],
            unique: true
        },
        email:{
            type: String,
            required: [true, 'Email is required']
        },
        password:{
            type: String,
            required: [true, 'Password is required']
        },
        role:{
            type: String,
            default: "CLIENT"
        }
    }
)


//crear y exportar el proyecto
export default model('Client', clientSchema) 
