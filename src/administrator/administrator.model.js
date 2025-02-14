import { Schema, model } from 'mongoose'

const administratorSchema = Schema(
    {
        name: {
            type: String,
            maxLength: [50, "Name can't exceed 50 characters"],
            required: [true, 'Name is required']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            //match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        role: {
            type: String,
            default: 'ADMIN',
            required: [true, 'Role is required']
        },
        isActive: {
            type: Boolean,
            default: true
        },
        createdProducts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            }
        ]
    }
)

export default model('Administrator', administratorSchema)