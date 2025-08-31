const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/dbConnect");
const userRoute = require("./routes/userRoute");
const taskRoute = require("./routes/taskRoute");
const categoryRoute = require("./routes/categoryRoute");
const app = express();


require("dotenv").config();

// Middlewares
app.use(express.json());
app.use(cookieParser());


// Cross orgin resources sharing which allows to connect to fonrtend of the desired domain to make request in this backend.
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


// Mounting api-url on routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/task", taskRoute);
app.use("/api/v1/category", categoryRoute);


const PORT = process.env.PORT || 4000;

const startServer = async() => {
    try{
        await dbConnect();
        app.listen(PORT, () => {
            console.log(`App is running at port no. ${PORT}`)
        })
    }
    catch(error){
        console.log("Something went wrong: ", error);
    }
}

startServer();


app.get("/", (req, res) => {
    console.log("Your server is up and running");
    return res.status(200).json({
        success: true,
        message: "Your server is running"
    })
})

