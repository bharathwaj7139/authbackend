const dbconnect = require("./db/dbconnect")
const User = require("./db/usermodule")
const dotenv = require("dotenv")
const bcrypt = require("bcryptjs")
const express = require("express")
const jwt = require("jsonwebtoken")
const auth = require("./auth")

dotenv.config()


const app = express()

app.use(express.json())

// register endpoint
app.post("/register", (request, response) => {
    // hash the password
    bcrypt
        .hash(request.body.password, 10)
        .then((hashedPassword) => {
            // create a new user instance and collect the data
            const user = new User({
                email: request.body.email,
                password: hashedPassword,
            });

            // save the new user
            user
                .save()
                // return success if the new user is added to the database successfully
                .then((result) => {
                    response.status(201).send({
                        message: "User Created Successfully",
                        result,
                    });
                })
                // catch error if the new user wasn't added successfully to the database
                .catch((error) => {
                    response.status(500).send({
                        message: "Error creating user",
                        error,
                    });
                });
        })
        // catch error if the password hash isn't successful
        .catch((e) => {
            response.status(500).send({
                message: "Password was not hashed successfully",
                e,
            });
        });
});


// login endpoint
app.post("/login",(req,res)=>{

    // check if email exists
    User.findOne({email:req.body.email})

     // if email exists
    .then((user)=>{
        // compare the password entered and the hashed password found
        bcrypt.compare(req.body.password,user.password)

        // if the passwords match
        .then((passwordchecks)=>{

            // check if password matches
            if(!passwordchecks){
                return response.status(400).send({
                    message:"password does not match",
                    error,
                })
            };

            //create jwt token
            const token =jwt.sign(
                {
                    userId: user._id,
                    userEmail: user.email,
                },
                "RANDOM TOKEN",
                {expiresIn:"24h"}
            );

            //return success response

            res.status(200).send({
                message:"Login successfully",
                email:user.email,
                token,
            });

        })

        // catch error if password does not match
        .catch((error)=>{
            res.status(400).send({
                message:"password does not match",
                error,
            })
        })
    })

    // catch error if email does not exist
    .catch((e)=>{
        res.status(404).send({
            message:"email not found",
            e,
        })
    })

})


// free endpoint
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/auth-endpoint", auth,(request, response) => {
  response.json({ message: "You are authorized to access me" });
});
//jjjjj

app.use((req,res,next)=>{
    res.setHeaders("Access control Allow-Orgin","*")
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Orgin,X-Requested-With,Content,Accept,Content-Type,Authorization"
    )
    res.setHeader(
        "Access-Control-Allow-Methods",
        "Get,Post,Put,Delete,Patch,Options"
    )
    next()
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



dbconnect();