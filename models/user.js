const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://www.kindpng.com/picc/m/22-223965_no-profile-picture-icon-circle-member-icon-png.png"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})
mongoose.model("User",userSchema)