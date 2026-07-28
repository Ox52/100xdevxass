const express = require("express")

const app = express()

const Port = 3000

app.use(express.json())


function logreq(req,res,next){


    const log = `${req.method} and ${req.url} and ${Date.now().toString()}`

    console.log(log)
    next()
}

app.use(logreq)


app.get("/user" , (req,res)=>{

    res.status(200).json({message:"hello world"})


})