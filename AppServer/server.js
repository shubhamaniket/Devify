require('colors');
const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes/allroutes');
const connectdb = require('./config/db');
const app = express();

dotenv.config({path : './config/config.env'});
connectdb();

app.use(express.json());
app.use(routes);
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server Running at PORT ${PORT}`.cyan.bold);
})