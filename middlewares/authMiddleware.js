const JWT = require("jsonwebtoken");
const User = require("../models/userModel")

const requireSignIn = async (req, res, next) => {
    try {
        req.user = JWT.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        next();
    } catch(error){
        console.log(error)
        res.status(401).send({
            success: false,
            error,
            message: "Error Accessing",
        });
    }
}

const isAdmin = async (req, res, next) => {
    const { email } = req.user;
    const isAdmin = await User.findOne({email: email});
    if(isAdmin.roles !== "admin"){
        throw new Error("Access denied, not an admin");
    } else {
      next();
    }
}

const isInstructor = async (req, res, next) => {
    const { email } = req.user;
    const isInstructor = await User.findOne({email: email});
    if(isInstructor.roles !== "instructor"){
        throw new Error("Access denied, not an instructor");
    } else {
        next();
    }
}


module.exports = {requireSignIn, isAdmin, isInstructor};
