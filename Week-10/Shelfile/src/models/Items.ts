import mongoose, { Schema } from "mongoose";



const ItmeSchema = new Schema({

    household:{
        type: Schema.Types.ObjectId,
        ref:"Household",
        required:true
    },
    addedby:{

        type:Schema.Types.ObjectId,
        require:true,
        trim:true
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


const Items = mongoose.model("Items",ItmeSchema)

export default Items