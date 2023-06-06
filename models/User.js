const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        name: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true,
            min: 8
        },
        gender: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
            minLength: 6
        },
        posts: {
            type: Array
        }
    }, {
    timestamps: true
});

const User = mongoose.model("user", userSchema);
module.exports = User;