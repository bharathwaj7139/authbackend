const mongoose = require("mongoose");
require("dotenv").config()

async function dbconnect() {
    mongoose.connect( process.env.DB_URL,
        {
           useNewUrlParser: true,
           useUnifiedTopology: true,
            // useCreateIndex: true,
            

        })

        .then(()=>{
            console.log("successfully connected to MongoDB Atlas!")
        })
        .catch((error)=>{
            console.log("unable to connect MongoDB Atlas!")
            console.error(error)
        })
    
}

module.exports =dbconnect;