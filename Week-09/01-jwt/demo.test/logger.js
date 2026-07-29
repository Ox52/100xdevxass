const express = require("express")
const app = express()
const Port =3000;


app.use(express.json())

const JWT_SECERT = "addadad"

let users =[]


app.post("/signup" , (req,res)=>{


    const {username ,email ,password} = req.body;

    const user = users.find((user)=>user.username ===username)

    if(user){
        return res.status(400).json({message:"user already exits"})


    }

    const newUser = {
        id:Date.now()*10000,
        username,
        email,
        password
    }

    users.push(newUser)

    return res.status(200).json({

        id:newUser.id,
        username:newUser.username,
        email:newUser.email,
        password:newUser.password


    })
})

app.post("/login", (req,res)=>{


    const {email , password} = req.body;

    const user = users.find((user)=>user.email ===email && user.password ===password)

    if(!user){

        return res.status(404).json({message:"Invalid creds"})
    }

    //create jwt


    const token = jwt.sign({

        id:user.id,
        username:user.username
    }, JWT_SECERT)

    res.json({token})

});


function auth( req,res,next){
const token = req.headers.authorization;

if(!token){

    res.status(404).json({message:"invalid token"})
}



try {

    const decode = jwt.verify(token, JWT_SECERT)
    req.user =decode

    
    
    next()
} catch (error) {

    res.status(400).json({message:"invalid"})
    
}
}