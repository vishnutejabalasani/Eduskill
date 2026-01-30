const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');
const createSendToken = require('../utils/generateToken');
const logger = require('../utils/logger');

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role || 'student'
        });

        createSendToken(newUser, 201, res);
    } catch (err) {
        logger.error('Signup Error:', err);
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1) Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide email and password!'
            });
        }

        // 2) Check if user exists && password is correct
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect email or password'
            });
        }

        // 3) If everything ok, send token to client
        createSendToken(user, 200, res);
    } catch (err) {
        logger.error('Login Error:', err);
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.updateMe = async (req, res, next) => {
    try {
        // 1) Create error if user POSTs password data
        if (req.body.password || req.body.passwordConfirm) {
            return res.status(400).json({
                status: 'fail',
                message: 'This route is not for password updates. Please use /updateMyPassword.'
            });
        }

        // 2) Filtered out unwanted field names that are not allowed to be updated
        // For now, allow updating name and email (with check if email taken handled by error)
        // Ideally we filter body: const filteredBody = filterObj(req.body, 'name', 'email');

        // 3) Update user document
        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            name: req.body.name,
            // email: req.body.email // Email update requires verification usually, careful here
        }, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.protect = async (req, res, next) => {
    try {
        // 1) Getting token and check of it's there
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 'fail',
                message: 'You are not logged in! Please log in to get access.'
            });
        }

        // 2) Verification token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({
                status: 'fail',
                message: 'The user belonging to this token does no longer exist.'
            });
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: 'Invalid token or session expired.'
        });
    }
};
