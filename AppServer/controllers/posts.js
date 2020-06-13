const PostsSchema = require('../models/posts');


//@access PRIVATE
//@desc create post     /createPost
exports.createPost = async (req,res,next)=>{
    try{
        const post = await PostsSchema.create(req.body);

        return res.status(201).json({
            success : true,
            message : 'Post Successfully created',
            postedBy : req.user
        })
    }
    catch(err){
        if(err.name === 'ValidationError'){
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({
                success : false,
                message : messages
            })
        }
        else{
            return res.status(500).json({
                success : false,
                message : 'Server Issue'
            })
        }
    }
}

//@access PRIVATE
//@desc create post     /getPostById
exports.getPostById = async (req,res,next)=>{
    try {
        const user = await PostsSchema.findById(req.params.id);
        if(!user){
            return res.status(400).json({
                success : false,
                message : 'Post not found !'
            })
        }
        return res.status(200).json({
            success : false,
            data : user
        })
    } catch (error) {
        return res.status(500).json({
            success :false,
            messgae : 'Server Error !'
        })
    }
}

//@access PRIVATE
//@desc find posts     /getAllPosts
exports.getAllPosts = async (req,res,next)=>{
    try {
        const getPosts = await PostsSchema.find();
        return res.status(200).json({
            success : true,
            data : getPosts
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : 'Server Error !'
        })
    }
}

// UPDATE update posts
exports.updatePosts = async (req,res,next) => {
    try{
        const updatePost = await PostsSchema.findByIdAndUpdate(req.params.id,req.body,{
            new : true,
            runValidators : true
        });
        if(!updatePost){
            return res.status(404).json({
                success : false,
                message : 'Post not found !'
            })
        }
        return res.status(200).json({
            success : true,
            data : updatePost
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            message : 'Server Error'
        })
    }
}