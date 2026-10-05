import mongoose, { Schema } from "mongoose";



const ItemSchema = new Schema({

    householdId:{
        type: Schema.Types.ObjectId,
        ref:"Household",
        required:true
    },
    addedBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    
    name:{
        type:String,
        required:true,
        trim:true


    },

    category:{

        type:String,
        enum:[
            "produce",
            "dairy",
            "meat",
            "pantry",
            "frozen",
            "other",

        ],
        required:true,
    },
    quantity:{
        type:Number,
        default:1,
        min:0
    },
    expiryDate:{
        type:Date
    },
    status:{

        type:String,
        enum:[
            "fresh",
            "expiring-soon",
            "expired",
            "used",
            "wasted",

        ],
        default: "fresh",
    }
},{
    timestamps: true,

})


const Item = mongoose.model("Item",ItemSchema)

export default Item
