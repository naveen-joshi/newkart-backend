const express = require('express');
const router = express.Router();
const User = require('../model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// const {registerUser, loginUser, getUser} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware')

// router.post('/', registerUser);
// router.post('/login', loginUser);
// router.get('/me', protect, getUser);

router.get('/', protect, async(req, res) => {
    const userList = await User.find().select('-passwordHash');

    if(!userList) {
        res.status(500).json({success: false});
    }
    res.send(userList);
})

router.get('/:id', protect, async(req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user) {
        res.status(500).json({success: false});
    }
    res.send(user);
})

router.post('/', async(req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        pincode: req.body.pincode,
    })

    user = await user.save();

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})
router.post('/register', async(req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        pincode: req.body.pincode,
    })

    user = await user.save();

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})

router.put('/:id', async(req, res) => {
    const userExist = await User.findById(req.params.id);
    let newPassword;
    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
        newPassword = userExist.passwordHash;
    }

    let user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            apartment: req.body.apartment,
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            pincode: req.body.pincode,
        },
        { new: true }
    )

    if(!user)
    return res.status(400).send('the user cannot be updated!')

    res.send(user);
})

router.post('/login', async(req, res) => {
    const user = await User.findOne({email: req.body.email});

    if(!user) {
        res.status(400).send('User Email not Registered');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign({
            userId: user.id,
            isAdmin: user.isAdmin
        }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(200).send({user: user.email, token: token});
    } else {
        res.status(200).send('password incorrect');
    }
})

router.get('/get/count', async(req, res) => {
    const userCount = await User.countDocuments(count => count);

    if(!userCount) {
        res.status(500).json({success: false});
    }
    res.send({count: userCount});
})

router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id).then(user => {
        if(user) {
            return res.status(200).json({success: true, message: 'user Deleted'});
        } else {
            return res.status(404).json({success: false, message: 'user Not Found'});
        }
    }).catch(err => {
        return res.status(500).json({success: false, error: err});
    })
})

module.exports = router