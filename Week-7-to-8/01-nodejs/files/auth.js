const express = require("express")
const app = express()
const Port = 3000

app.use(express.json())
let users = []

app.post("/signup", (req,res)=>{



    const { username,firstName , LastName, email,password} = req.body;

    const user = users.find((user)=> user.username ===username)

    if(user){

        return res.status(404).json({

            message:"user already exits"
        })
    }

      const newUser ={
        username,
        firstName,
        LastName,
        email,
        password
      }

      users.push(newUser)
    

    res.json({
        username:newUser.username,
        email:newUser.email
    })
})


app.post("/login", (req,res)=>{

    const { email , password} = req.body

    const user = users.find((user)=> user.email ===email && user.password===password)

    if( !user){

        return res.status(404).json({
            message:"user does not exits"
        })
    }

        res.status(201).json({

            message:"user login",
            email:user.email,
            firstName:user.firstName,
            LastName:user.LastName
        })
    
})


app.get("/data", (req,res)=>{

    const {email ,password} = req.body;

    const user = users.find((user)=> user.email===email && user.password ===password)


    if(!user){
        res.status(404).json({
            message:"user not exits"
        })
    }


    const userList = users.map((user)=>({

        username:user.username,
        firstName:user.firstName,
        lastName:user.lastName,
        email:user.email
    }))

    res.status(200).json({
      users:userList
    })
})

app.use((req,res)=>{

    res.status(404).json({
        message:"route not found"
    })
})

app.listen(Port,()=>{

    console.log(`Server is runningh on port`)
})