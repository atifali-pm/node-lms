const userModel = require("../models/userModel")
const {hashPassword, comparePassword} = require("../helper/authHelper");
const JWT = require("jsonwebtoken");
const {all} = require("express/lib/application");
const validateMongoDbId = require("../config/validateMongoDbId");
const sendEmail = require("./emailController");
const crypto = require("crypto");

const register = async (req, res) => {
    try {

        const { first_name, last_name, email, user_image, mobile, password,  roles, profession } = req.body;

        // validations
        if (!first_name) {
            return res.send({error: "First name is required"});
        }

        // validations
        if (!last_name) {
            return res.send({error: "First name is required"});
        }

        if (!email){
            return res.send({message: "Email is required"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send({
                success: false,
                message: 'Invalid email address'
            });
        }

        if (!user_image){
            return res.send({message: "Image is required"});
        }

        if (!mobile){
            return res.send({message: "Mobile number is required"});
        }

        if (!password){
            return res.send({message: "Password is required"});
        }

        if (!roles){
            return res.send({message: "Role is required"});
        }


        if (!profession){
            return res.send({message: "Profession is required"});
        }

        // Check existing user
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(400).send({
                success: false,
                message: "Already registered please login"
            })
        }

        const hashedPassword = await hashPassword(password);

        const user = await new userModel({
            first_name,
            last_name,
            email,
            user_image,
            mobile,
            password: hashedPassword,
            roles,
            profession
        }).save();

        // // Generate a random verification code
        // const verificationCode = Math.floor(100000 + Math.random() * 900000);
        //
        // // Create the email content
        // const mailOptions = {
        //     from: process.env.MAIL_USER,
        //     to: email,
        //     subject: 'Email Verification',
        //     text: `Your verification code is: ${verificationCode}`
        // };

        // // Send the email
        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         console.error(error);
        //         res.status(500).send('Failed to send verification email.');
        //     } else {
        //         console.log('Verification email sent: ' + info.response);
        //         res.status(200).send('Verification email sent.');
        //     }
        // });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        })
    } catch (error){
        res.status(500).json({
            status: false,
            message: "An error occurred while fetching users.",
            error: error.message,
        })
    }
};

// Login callback
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body

        console.log(email, password);

        if(!email || !password){
            return res.status(404).send({
                success: false,
                message: "Invalid email or password"
            })
        }

        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success: false,
                message: "Email is not registered"
            })
        }

        const match = await comparePassword(password, user.password);

        if(!match){
            return res.status(404).send({
                success: false,
                message: "Invalid password"
            })
        }

        const token = await JWT.sign({_id: user._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES, //"7d",
        });

        res.status(200).send({
            success: true,
            message: "Login successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                roles: user.roles
            },
            token,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in login",
            error
        })
    }
};

const updateUser = async (req, res) => {

    try {


    } catch (e) {
        console.log(e)
        res.status(500).send({
            success: false,
            message: "Error in update user",
            e
        })
    }

};

const getAllUser = async (req, res) => {
    try{
        const allUsers = await userModel.find({}, { _id: 0, password: 0, __v: 0 });
        res.status(200).json({
            status: true,
            message: "All users fetched successfully!",
            users: allUsers,
        })
    } catch (error){
        res.status(500).json({
            status: false,
            message: "An error occurred while fetching users.",
            error: error.message,
        })
    }
};

const getUser = async (req, res) => {
  try{
        const { id } = req.params;
        validateMongoDbId(id);
        const getProfile = await userModel.findById(id).select('-_id -password -__v');
        if(!getProfile){
            return res.status(404).json({
                status: false,
                message: "User not found"
            })
        }
        res.status(200).json({
            status: true,
            message: "User found",
            user: getProfile
        })
  }  catch (error){
      res.status(500).json({
          status: false,
          message: "An error occurred while fetching user.",
          error: error.message
      })
  }
};

const deleteUser = async (req, res) => {
    try{
        const { id } = req.params;
        validateMongoDbId(id);
        const getProfile = await userModel.findById(id).select();
        if(!getProfile){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        await userModel.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    } catch (error){
        res.status(500).json({
            status: false,
            message: "An error occurred while deleting a user",
            error: error.message
        })
    }
};

const blockAUser = async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id);
    try{
        const block = await userModel.findByIdAndUpdate(
            id,
            {is_blocked: true},
            {new: true}
        );
        res.status(200).json({
            status: 201,
            success: true,
            message: "User successfully blocked!"
        })
    } catch (error){
        res.status(500).json({
            status: false,
            message: "An error occurred while blocking a user",
            error: error.message
        })
    }
};

const unBlockAUser = async (req, res) => {
    try{
        const { id } = req.params
        validateMongoDbId(id);
        const unblocked = await userModel.findByIdAndUpdate(
            id,
            {is_blocked: false},
            {new: true}
            );
        res.status(200).json({
            status: 201,
            success: true,
            message: "User successfully unblocked!"
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "An error occurred while unblocking a user",
            error: error.message
        })
    }
}

const updatePassword = async (req, res) => {
  try{
      const { _id } = req.user;
      const { password } = req.body;
      validateMongoDbId(_id);
      const user = await userModel.findById(_id);
      if(user && (await user.isPasswordMatched(password))){
          return res.status(404).json({
              success: false,
              message: "Provide a new password instead of old one",
          })
      } else {
          user.password = password;
          await user.save();
          res.status(200).json({
              success: true,
              message: "Password updated successfully!"
          });
      }
  }  catch (error) {
      res.status(500).json({
          status: false,
          message: "An error occurred while updating password!",
          error: error.message
      })
  }
};

const forgotPasswordToken = async (req, res) => {
  try {
      const { email } = req.body;
      const user = await userModel.findOne({email: email});
      if(!user) {
          throw new Error("User not found!")
      }

      const token = await user.createPasswordResetToken();
      await user.save();
      const resetLink = `http://localhost:5000/api/user/reset-password/${token}`
      const data = {
          to: email,
          text: `Hey ${user.first_name + " " + user.last_name}`,
          subject: "Forgot password",
          html: resetLink
      };
      sendEmail(data);
      res.status(200).json(resetLink);

  }  catch (error) {
      res.status(500).json({
          status: false,
          message: "An error occurred while sending forgot password token!",
          error: error.message
      })
  }
};

const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const { token } = req.params;
        const hashed_token = crypto.createHash("sha256").update(token).digest("hex");
        const user = await userModel.findOne({
            password_reset_token: hashed_token,
            password_reset_expires: { $gt: Date.now()},
        });

        if(!user){
            throw new Error("Token Expired, please try again!")
        }

        user.password = password;
        user.password_reset_token = undefined;
        user.password_reset_expires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully!"
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "An error occurred while reseting password!",
            error: error.message
        })
    }
};


module.exports = { loginUser, updateUser, register, getAllUser, getUser, deleteUser, blockAUser, unBlockAUser, updatePassword, forgotPasswordToken, resetPassword}