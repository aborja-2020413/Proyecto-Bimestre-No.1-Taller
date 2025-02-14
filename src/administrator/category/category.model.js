import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            unique: true,
            maxLength: [100, 'Category name cannot exceed 100 characters']
        },
        description: {
            type: String,
            required: [true, 'Description is required']
        }
    }
);

export default model('Category', categorySchema);