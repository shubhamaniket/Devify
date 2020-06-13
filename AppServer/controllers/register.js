const registerUser = require('../models/registerUser');

exports.getUsers = async (req,res,next)=>{
    try{
        const Users = await registerUser.find();
        res.status(200).json({
            success : true,
            count : Users.length,
            data : Users
        })
    }
    catch(err){
        res.status(500).json({
            success : false,
            message : 'Server Error !'
        })
    }
}

exports.createUser = async (req,res,next)=>{
    try {
        const create = await registerUser.create(req.body);
        const token = create.getSignedJwtToken();

        res.status(201).json({
            success : true,
            token : token,
            data : create
        })
    } catch (err) {
        if(err.name === 'ValidationError'){
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({
                success : false,
                message : messages
            })
        }
        else if(err.code === 11000){
            return res.status(400).json({
                success : false,
                message : 'Email id already exists'
            })
        }
        else{
            res.status(500).json({
                message : 'Server Error'
            })
        }
    }
}

exports.signUser = async (req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            success : false,
            message : 'Please enter all the credetials !'
        })
    }
    const user = await registerUser.findOne({email}).select('+password');

    //Check for User
    if(!user){
        return res.status(400).json({
            success : false,
            message : 'User doesn\'t exists !'
        })
    }
    //Check for password
    const isMatch = await user.matchPassword(password);
    if(!isMatch){
        return res.status(400).json({
            success : false,
            message : 'Invalid Creditials !'
        })
    }

    const token = user.getSignedJwtToken();

    return res.status(200).json({
        success : true,
        token : token
    })
}