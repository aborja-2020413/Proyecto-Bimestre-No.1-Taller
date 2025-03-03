import { Schema, model } from 'mongoose'

const administratorSchema = Schema(
    {
        name: {
            type: String,
            maxLength: [50, "Name can't exceed 50 characters"],
            required: [true, 'Name is required']
        },
        username:{
            type: String,
            required: [true, 'Username is required'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true
        },
        role: {
            type: String,
            default: 'ADMIN',
        }
    }
)

export default model('Administrator', administratorSchema)