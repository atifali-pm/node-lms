const mongoose = require("mongoose")

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

//export
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;