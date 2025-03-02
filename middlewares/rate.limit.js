//limitar la cantidad de solicitudes en cierto tiempo
import rateLimit from "express-rate-limit";

export const limiter = rateLimit(
    {
        windowMs: 10 * 1000, 
        max: 200, 
        message: {
            message: "You'r blocked, wait 15 minutes"
        }

    }

)
