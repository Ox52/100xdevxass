

import express from "express"
import router from "./routes/auth.routes"

 const app = express()

 app.use(express.json())

 
 app.use("/api/auth" , router)


 app.get("/", (req,res)=>{

    res.json({

        message:"shelflife is api is runn"  
    })
 })

 export default app