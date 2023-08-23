const express = require("express")
const {loginUser, updateUser, register, getAllUser, getUser, deleteUser, blockAUser, unBlockAUser} = require("../controllers/userController");
const userRouter = express.Router();
const {requireSignIn} = require("../middlewares/authMiddleware")

userRouter.post("/register", register)
userRouter.post("/login", loginUser)
userRouter.put("/update", requireSignIn, updateUser)
userRouter.get("/", getAllUser)
userRouter.get("/:id", getUser)
userRouter.delete("/:id", deleteUser)
userRouter.put("/block/:id", blockAUser)
userRouter.put("/unblock/:id", unBlockAUser)

module.exports = userRouter;