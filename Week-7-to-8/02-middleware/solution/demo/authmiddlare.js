const express = require('express');
const app = express();
const VALID_API_KEY = '100xdevs_cohort3_super_secret_valid_api_key'; 



function authMiddlare(req,res,next){

    if(apIKEY && apIKEY===VALID_API_KEY){
        next();
    }else{

        res.status(400).json({

            message:"invalid"
        })
    }


}

app.use(authMiddlare)

app.get((req,res)=>{

    res.status(200).json({message:"access granted"})
})