const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

let userSchema = new mongoose.Schema({
        first_name: {
            type: String,
            required: [true, 'First name is required'],
            unique: true,
            index: true
        },
        last_name: {
            type: String,
            required: [true, 'Last name is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required and should be unique'],
            unique: true,
            email: true,
        },
        user_image: {
            type: String,
            default: true
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        roles: {
            type: String,
            default: "user"
        },
        profession: {
            type: String,
            required: true,
        },
        is_blocked: {
            type: Boolean,
            default: false
        },
        password_changed_at: {
            type: Date
        },
        password_reset_token: {
            type: String
        },
        password_reset_expires: {
            type: Date
        },
        stripe_account_id: {
            type: String
        },
        stripe_seller: {},
        stripe_session: {}
    },
    {
        timestamp: true
    }
);

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt = await  bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.createPasswordResetToken = async function(){
   const reset_token = crypto.randomBytes(32).toString("hex");
   this.password_reset_token = crypto.createHash("sha256").update(reset_token).digest("hex");
   this.password_reset_expires = Date.now() + 30*60*1000;
   return reset_token;
};


userSchema.methods.isPasswordMatched = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

//export
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;