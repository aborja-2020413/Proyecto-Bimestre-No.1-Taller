import {Schema, model} from 'mongoose'

const clientSchema = Schema (
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
            maxLength: [15,  `Can't be overcome 15 characters`]
        },
        email:{
            type: String,
            required: [true, 'Email is required']
        },
        password:{
            type: String,
            required: [true, 'Password is required'],
            minLength: [8, 'Password must be 8 characterers'],
            maxLength: [100, `Can't be overcome 16 characterers`]
        },
        role:{
            type: String,
            default: "CLIENT"
        }
    }
)


//crear y exportar el proyecto
export default model('Client', clientSchema) 
