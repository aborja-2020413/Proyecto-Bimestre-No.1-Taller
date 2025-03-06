//CONEXION A LA DB
import mongoose from "mongoose";
import Category from '../src/administrator/category/category.model.js'

export const connect = async()=>{
    try{
        //CICLO DE VIDA DE MOONGOSE
        mongoose.connection.on('error', ()=>{
          console.log('MongoDB | Could not be connected to mongoDB')  
        })
        mongoose.connection.on('connecting', ()=>{
            console.log('MongoDB | try connecting')  
        })
        mongoose.connection.on('connected', ()=>{
            console.log('MongoDB | connected to mongoDB')  
        })
        mongoose.connection.once('open', ()=>{
            console.log('MongoDB | connected to database')  
            initializeDefaultCategory(); // Se ejecuta al abrir la conexión
        })
        mongoose.connection.on('reconnected', ()=>{
            console.log('MongoDB | reconnected to mongoDB')  
        })
        mongoose.connection.on('disconnected', ()=>{
            console.log('MongoDB | disconnected')  
        })

        await mongoose.connect(
            `${process.env.DB_SERVICE}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
            {
                maxPoolSize: 50, //Maximo de conexines 
                serverSelectionTimeoutMS: 5000 //Tiempo maximo para intentar conectarse
            }
        )
    }catch(err){
        console.log('Database connection failed', err)
    }
}


// Función para crear la categoría por defecto si no existe
export const initializeDefaultCategory = async () => {
    try {
        const existingCategory = await Category.findOne({ name: "general" });

        if (!existingCategory) {
            const defaultCategory = new Category({
                name: "general",
                description: "Esta es la categoría por defecto para productos sin categoría."
            });
            await defaultCategory.save();
            console.log("Categoría por defecto creada.");
        } else {
            console.log("La categoría por defecto ya existe.");
        }
    } catch (error) {
        console.error("Error al crear la categoría por defecto:", error);
    }
};


