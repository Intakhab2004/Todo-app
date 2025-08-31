const mongoose = require("mongoose");


async function dbConnect(){
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log("Server connected to the DB successfully");
    }
    catch(error){
        console.log("Something went wrong while connecting with the DB");
        console.error(error);
        process.exit(1);
    }
}

module.exports = dbConnect;