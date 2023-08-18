const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDb = require("./config/connectDb");
const {notFound, handleError} = require("./middlewares/errorHandler");
const userRouter = require("./routes/userRoutes")
const bodyParser = require("body-parser");
// config dot env file
dotenv.config();

//databse call
connectDb();

//rest object
const app = express();

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//app.use(notFound);
app.use(handleError)

//routes
app.get("/", (req, res) => {
    res.send("Hello from LMS")
})

//user routes
app.use("/api/v1/user", userRouter);
const PORT = 5000 || process.env.PORT;

//listen server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});