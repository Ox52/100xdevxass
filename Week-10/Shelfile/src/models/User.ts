
import mongoose, { Schema } from "mongoose";


const UserSchema = new Schema({


    name:{
        type:String,
        required:true,
        minlength:2,
        maxlength:30,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{

        type:String,
        required:true,
        minlength:6
    },
    householdId:{
        type: Schema.Types.ObjectId,
        ref:"Household",
        default:null,
    },
},{

    timestamps:true,
})

const User = mongoose.model("User", UserSchema)


 export default User
