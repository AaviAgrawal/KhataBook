const mongoose = require("mongoose");

const hisaabSchema = mongoose.Schema(
    {
        title:{
            trim:true,
            type:String,
            minlength:3,
            maxlength:100,
            required:true,
        },
        description:{
            type:String,
            required:true,
            trim:true,
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        encrypted:{
            type:Boolean,
            default:false,
        },
        shareable:{
            type:Boolean,
            default:false,
        },
        passcode:{
            type:String,
            default:"",
        },
        editpermissions:{
            type:Boolean,
            default:false,
        },
    },
    {timestamps:true}
);

module.exports = mongoose.model("hisaab",hisaabSchema);