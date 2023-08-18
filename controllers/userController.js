const userModel = require("../models/userModel")
const {hashPassword, comparePassword} = require("../helper/authHelper");
const JWT = require("jsonwebtoken");

const register = async (req, res) => {
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

module.exports = { loginUser, updateUser, register }