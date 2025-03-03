import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            unique: true
        },
        description: {
            type: String,
            required: [true, 'Description is required']
        }
    }
);

export default model('Category', categorySchema);