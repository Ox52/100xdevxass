const express = require("express");
const app = express();
const Port = 3000;

app.use(express.json())
let requestCount = 0

app.use((req,res,next)=>{

    requestCount += 1;
    
   next()
})

app.get("/user" , (req,res)=>{

   return  res.status(200).json({

        message:"alice is herer"
    })
})


app.post("/user", (req,res)=>{

    return res.status(200).json({
        message:"harsh is here"
    })
})

app.get("/request",(req,res)=>{

    return res.status(200).json({requestCount})
})