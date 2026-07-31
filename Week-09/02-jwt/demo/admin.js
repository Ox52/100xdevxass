const express = require("express")
const jwt = require("jsonwebtoken")
const app = express()

app.use(express.json())

const JWT_SECERT ="dadada"

const users = []


app.post("/signup", (req,res)=>{

    const {username,email,password,role}=req.body;
 

    const user = users.find((user)=>user.username ===username);

    if(user){
        return res.status(404).json({message:"user already exits"})
    }

    if(role !=="admin" && role !=="guest"){
        return res.status(401).json({message:"need role"})
    }

const newUser ={
    id:Date.now(),
    username,
    email,
    password,
    role
}

users.push(newUser)


res.status(201).json({
    id:newUser.id,
    username:newUser.username,
    email:newUser.email,
    password:newUser.password,
    role:newUser.role

})

})


app.post("/login", (req,res)=>{


    const{email ,password } = req.body;

    const user = users.find((u)=>u.email===email && u.password ===password)

    if(!user){

        return res.status(404).json("invalid cred")

    }

   const token = jwt.sign({

    email:user.email,
    password:user.password,
    role:user.role
   }, JWT_SECERT,{
    expiresIn:"1m"
   })


   res.json(token)
})


function authmiddleware( req,res,next){



    const token = req.headers.authorization;

    if(!token){

        return res.json("token needed")
    }


    try {

        const decode = jwt.verify(token,JWT_SECERT)

        req.user =decode
        next()
        
    } catch (error) {

        res.status(404).json({message:"error"})
        
    }
}

function isAdmin(req,res,next){


    if(req.user.role !=="admin"){

        return res.status(401).json({message:"access denied"})


    }

    next()
}

app.get("/user", authmiddleware ,(req,res)=>{

    res.json({user:req.user})


})


app.get("/admin" , authmiddleware, isAdmin,(req,res)=>{


    res.json("welcom admin")



})