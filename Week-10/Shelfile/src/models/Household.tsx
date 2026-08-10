 import mongoose, { Schema } from "mongoose";


 const HouseholdSchema = new Schema({


    name:{
        type:String,
        required:true,

    },
    inviteCode:{
        type:String,
        required:true,
        minlength:6,
        maxlength:6,
        uppercase:true,
        unique:true
    },
    members:[
        {
            type: Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    admin:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true

    },
    wasteScore:{
        type:String,
        default:0,
        min:0,
        max:100,
    }
 },{
    timestamps:true
 });



 const Household = mongoose.model("Household", HouseholdSchema)

 export default Household