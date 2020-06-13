const express = require('express');
const {getUsers,createUser,signUser} = require('../controllers/register');
const {createPost,getPostById,getAllPosts,updatePosts} = require('../controllers/posts');


const routes = express.Router();
const {protect} = require('../middleware/auth');

routes.route('/getUsers')
.get(getUsers);

routes.route('/createUser')
.post(createUser);

routes.route('/login')
.post(signUser);

routes
.route('/createPost')
.post(protect,createPost);

routes.route('/getPostById/:id')
.get(protect,getPostById);

routes.route('/getAllPosts')
.get(protect,getAllPosts)

routes
.route('/updatePost')
.put(protect,updatePosts)

module.exports = routes;