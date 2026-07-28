const express = require("express")

const app = express();

const Port = 3000;

app.use(express.json())


let numberOfRequestsForUser = {}


setInterval(() => {
    numberOfRequestsForUser = {}
    
},5000);

app.use((req,res,next)=>{


    const userId = req.headers["user-id"]

    if(!userId){
        return res.status(404).json("user not exits")
    }


    if(!numberOfRequestsForUser[userId]){

        numberOfRequestsForUser[userId] =1;

        return next()
    }
    numberOfRequestsForUser[userId]++

    if(numberOfRequestsForUser[userId]>5){

        return res.status(404).json({

            message:" limit exits"
        })
    }

    next()
})


app.get("/", (req,res)=>{

    res.json("request succefully")
})
app.listen(Port,()=>{

    console.log(`server is running`)
})