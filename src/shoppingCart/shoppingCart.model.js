import { Schema, model } from 'mongoose';

const cartSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'Client', // Cambiar 'User' por 'Client' si es el caso
            required: [true, 'User is required']
        },
        products: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product', // Referencia al modelo de producto
                required: [true, 'Product is required']
            }
        ],
        quantities: [
            {
                type: Number,
                required: [true, 'Quantity is required'],
                min: [1, 'Quantity must be at least 1']
            }
        ]
    },
    { timestamps: true } // Añade campos de creación y actualización automáticamente
);

export default model('Cart', cartSchema);