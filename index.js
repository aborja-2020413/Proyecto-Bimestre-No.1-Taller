//Ejecutar el proyecto
    //DESESTRUCTURAR
    import { initServer} from "./configs/app.js";
    import { config } from "dotenv"; //DECIRLE A NODE JS QUE SE USA DOTENV
    import { connect } from "./configs/mongo.js";
    
    config()
    initServer()
    connect()
    