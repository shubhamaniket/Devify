const mongoose = require('mongoose');
const registerUser = require('../models/registerUser');


const PostsSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true,'You need to have a title to submit !']
    },
    content : {
        type : String,
        required : [true,'Enter a body for your post']
    },
    image : {
        type : String,
        required : [true,'Please Upload an image']
    },
    postedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "registerUser"
    }
})

module.exports = mongoose.model('PostsSchema',PostsSchema);