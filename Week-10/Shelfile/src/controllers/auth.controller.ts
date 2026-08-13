import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";

import { Jwt } from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


export  const login = async( req:Request , res:Response) =>{

    try {


        const {emaiL , password} =req.body


        if(!email || !password){

            return res.status(400).json({
                message: "Email and password are required",
              });
        }


        const user = await User.findOne({email})

        if(!user){
            return res.status(401).json({
                message: "Invalid email or password",
              });

            
        }


        const isPasswordSame = await bcrypt.compare(

            password,
            user.password
        )


        if(!isPasswordSame){

            return res.status(401).json({
                message: "Invalid email or password",
              });
        }


        const token = jwt.sign(

            {

                userId: user._id,

            },

            process.env.JWT_SECERT!
        )



        return 
        res.status(200).json({

            message:
            
            "Login successful",

            token,

            id:  user?._id,
            name:user?.name,
            email:user?.emaiL


        })
        
    } catch (error) {

        console.error(error);

        return res.status(500).json({
          message: "Server error",
        });

      
        
    }



}