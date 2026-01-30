const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename: fieldname-timestamp-random.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File Filter (Images Only)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

exports.uploadPhoto = upload.single('photo');

exports.uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
    }

    // Return the URL to access the file
    // Assuming server serves 'public' folder as static
    // URL will be /uploads/filename.jpg
    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
        status: 'success',
        data: {
            url: fileUrl
        }
    });
};
