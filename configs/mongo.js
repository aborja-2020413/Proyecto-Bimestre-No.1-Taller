//CONEXION A LA DB
import mongoose from "mongoose";

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

