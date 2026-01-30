const User = require('../models/User');
const Course = require('../models/Course'); // Assuming we will need this for stats

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getStats = async (req, res, next) => {
    try {
        const userCount = await User.countDocuments();
        const courseCount = await Course.countDocuments();
        // const certificationCount = await Certification.countDocuments(); // Future

        res.status(200).json({
            status: 'success',
            data: {
                stats: {
                    users: userCount,
                    courses: courseCount,
                    revenue: 0 // Placeholder
                }
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};
