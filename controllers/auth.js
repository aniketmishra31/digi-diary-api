const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//CREATE TOKEN JWT
const createToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET);
}

// SIGNUP CONTROLLER
module.exports.signup = async (req, res) => {
    try {
        const {
            username,
            name,
            age,
            gender,
            password
        } = req.body;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            name,
            age,
            gender,
            password: hashedPassword,
            posts: []
        });
        const savedUser = await newUser.save();

        const token = createToken(savedUser._id);
        res.status(201).json({token, savedUser});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// LOGIN CONTROLLER
module.exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        //user details
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ error: "User does not exist" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        //deleteing user password so that it does not get sent back
        //return token
        const token = createToken(user._id);
        delete user.password;
        res.status(201).json({ token, user });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};