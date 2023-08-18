const express = require("express")
const {loginUser, updateUser, register} = require("../controllers/userController");
const userRouter = express.Router();
const {requireSignIn} = require("../middlewares/authMiddleware")

userRouter.post("/register", register)
userRouter.post("/login", loginUser)
userRouter.put("/update", requireSignIn, updateUser)

module.exports = userRouter;