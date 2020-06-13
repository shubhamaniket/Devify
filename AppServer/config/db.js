const mongoose = require('mongoose');
require('colors');

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGOURI, {
            useNewUrlParser : true,
            useCreateIndex : true,
            useUnifiedTopology : true,
            useFindAndModify : false
        })
        console.log(`Mongoose Connected ${conn.connection.host}!`.yellow.italic.bold);
    }
    catch(err){
        console.log(err.message)
        process.exit(1);
    }
}

module.exports = connectDB;