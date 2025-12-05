const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.register = async (req, res) => {
    try {
        const { username, email, password} = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({message : 'User already exists'});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt);
        const user = new User({ username, email, password: hashedPassword});
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, username: user.username, email: user.email}});
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req,res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json( { message: 'Invalid credentials' } );
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json( { message: 'Invalid credentials' } );
        }
        const token = jwt.sign( { id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d' } );
        res.json( { token, user: { id: user._id, username: user.username, email: user.email } } );
    } catch (err) {
        res.status(500).json( { message: 'Server error' } );
    }
};