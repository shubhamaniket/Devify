const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = new mongoose.Schema({
    name : {
        type : String,
        required : [true,'Please enter your name']
    },
    email : {
        type : String,
        unique : true,
        required : [true,"Enter your email"]
    },
    password : {
        type : String,
        required : [true,"Please enter your password"],
        min : [6,'Password should be between 6 to 16 character'],
        max : [16,'Password should be between 6 to 16 character']
    },
    photo : {
        type : String,
        default : 'no-photo.jpg'
    }
})
//Encrypting Passwords
registerUser.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
})
registerUser.methods.getSignedJwtToken = function(){
    return jwt.sign({id: this._id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRE
    })
}
registerUser.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

module.exports = mongoose.model('registerUser',registerUser);