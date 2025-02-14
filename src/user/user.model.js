import {Schema, model} from 'mongoose'

const userSchema = Schema (
    {
        name:{
            type: String,
            required: [true, 'Name is required'],
            maxLength: [25, `Can't be overcome 25 characters`]
        },
        surname:{
            type: String,
            required: [true, 'Surname is required'],
            maxLength: [25,  `Can't be overcome 25 characters`]
           
        },
        username:{
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            //lowercase: true,
            maxLength: [15,  `Can't be overcome 15 characters`]
        },
        email:{
            type: String,
            //VAMOS A VER QUE PASA SI NO ES UNICO
            //match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/],
            required: [true, 'Email is required']
        },
        password:{
            type: String,
            required: [true, 'Password is required'],
            minLength: [8, 'Password must be 8 characterers'],
            maxLength: [100, `Can't be overcome 16 characterers`],
            //match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm]
        },
        role:{
            type: String,
            required: [true, 'Role is required'],
            uppercase: true, //Volver en mayuscula
            enum: ['ADMINISTRATOR', 'CLIENT']
        }
    }
)


//crear y exportar el proyecto
export default model('User', userSchema) 
