import { Schema, model } from 'mongoose';

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            maxLength: [100, 'Product name cannot exceed 100 characters']
        },
        description: {
            type: String,
            required: [true, 'Description is required']
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative']
        },
        stock: {
            type: Number,
            required: [true, 'Stock is required'],
            min: [0, 'Stock cannot be negative']
        },
        sales: {
            type: Number,
            default: 0,
            min: [0, 'Sales cannot be negative'],
            required: [true, 'Stock is required'],
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',  // 🔥 Referencia a la colección de categorías
            required: [true, 'Category is required']
        }
    }
);

export default model('Product', productSchema);