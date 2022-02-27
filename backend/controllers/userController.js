const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../model/userModel');

// @desc Register New User
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async(req, res) => {
    console.log(req.body)
    const {username, email, password} = req.body;
    if(!username || !email || !password) {
        res.status(400)
        throw new Error('Please Add all fields')
    }

    // Check if user exists
    const userExists = await User.findOne({email})
    if(userExists) {
        res.status(400)
        throw new Error('User Already Exists')
    }

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    // Create User
    const user = await User.create({
        username,
        email,
        password: hashPassword
    })

    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.username,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid data')
    }
})

// @desc Authenticate an User
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email})
    if(user && (await bcrypt.compare(password, user.password))) {
        res.status(201).json({
            _id: user.id,
            name: user.username,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid Credentials')
    }
    res.json({message: 'Login user'})
})

// @desc Get User data
// @route Get /api/users/me
// @access Private
const getUser = asyncHandler(async(req, res) => {
    const {_id, name, email} = await User.findById(req.user.id)
    
    res.status(200).json({
        id: _id,
        name,
        email
    })
})

// @desc Update User Profile
// @route PUT /api/users/:id
// @access Public
const updateUser = asyncHandler(async(req, res) => {
    res.json({message: 'register user'})
})

// @desc Delete User
// @route Delete /api/users/:id
// @access Public
const deleteUser = asyncHandler(async(req, res) => {
    res.json({message: 'register user'})
})

// Generate Token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '30d'})
}

module.exports = { registerUser, loginUser, getUser, updateUser, deleteUser }