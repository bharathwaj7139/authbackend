const mongoose = require("mongoose")

const userschema = new mongoose.Schema({
    email:{
        type: String,
        required:[true,"Please Provide An Email"],
        unique:[true,"Email Exist"]
    },
    password:{
        type: String,
        required:[true,"Please Provide a Password"],
        unique:false,
    },
})

module.exports = mongoose.model("users",userschema)