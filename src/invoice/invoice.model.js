import { Schema, model } from 'mongoose';

const invoiceSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
            required: true
        },
        products: [{ type: Schema.Types.ObjectId, ref: 'Product', required: true }], // Array de productos
        quantities: [{ type: Number, required: true, min: 1 }], // Array de cantidades correspondientes
        
        total: {
            type: Number
        },
        status: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true // Agrega createdAt y updatedAt automáticamente
    }
);

export default model('Invoice', invoiceSchema);