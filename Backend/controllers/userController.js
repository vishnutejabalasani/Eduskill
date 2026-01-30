const User = require('../models/User');

exports.updateMe = async (req, res, next) => {
    try {
        // 1) Create error if user POSTs password data
        if (req.body.password || req.body.passwordConfirm) {
            return res.status(400).json({
                status: 'fail',
                message: 'This route is not for password updates.'
            });
        }

        // 2) Filtered out unwanted fields names that are not allowed to be updated
        // For now, we allow these:
        const allowedFields = ['name', 'email', 'title', 'hourlyRate', 'portfolio', 'experience', 'isOpenToWork', 'availability'];

        const filteredBody = {};
        Object.keys(req.body).forEach(el => {
            if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
        });

        // 3) Update user document
        const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
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

exports.getTalentProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
            .select('name title hourlyRate portfolio experience profile createdAt role isOpenToWork certifications testimonials')
            .populate({
                path: 'certifications',
                populate: {
                    path: 'course',
                    select: 'title category'
                }
            });

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getTalent = async (req, res, next) => {
    try {
        const talent = await User.find({ isOpenToWork: true }).select('name title hourlyRate portfolio experience profile availability');
        console.log("DEBUG: Found Talent count:", talent.length); // Debug log

        res.status(200).json({
            status: 'success',
            results: talent.length,
            data: {
                talent
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users }
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
