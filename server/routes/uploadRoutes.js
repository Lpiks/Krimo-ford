const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const router = express.Router();
const path = require('path');
const fs = require('fs');

// 1. ENVIRONMENT CHECK: Check for required Cloudinary variables
const {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
} = process.env;

// 2. CONFIG: Configure Cloudinary only if credentials are present
if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
    cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET
    });
} else {
    // If credentials are missing, log an error immediately upon server start
    console.error('CRITICAL ERROR: Cloudinary credentials are NOT configured. Uploads will fail.');
}

// 3. MULTER STORAGE CONFIGURATION

// Ensure the local 'uploads/' directory exists for Multer's temporary use
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        // Multer saves the file to the local disk temporarily
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        // Naming the file uniquely with date and original extension
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// File Type Checker
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only! Allowed types: jpg, jpeg, png');
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});


// 4. API ROUTE HANDLER (POST /api/upload)

// Use a separate handler for Multer errors to prevent generic 500 crashes
router.post('/', (req, res, next) => {
    upload.single('image')(req, res, async (err) => {
        // --- 4.1. Handle Multer Errors (e.g., file type, file size) ---
        if (err instanceof multer.MulterError) {
            return res.status(400).send({ message: `Multer Error: ${err.message}` });
        } else if (err) {
            // This captures the 'Images only!' error from checkFileType
            return res.status(400).send({ message: err });
        }

        // --- 4.2. Main Cloudinary Upload Logic ---

        try {
            // Check for critical missing environment variables again
            if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
                return res.status(500).send({ message: 'Cloudinary credentials are not configured on the server.' });
            }

            if (!req.file) {
                return res.status(400).send({ message: 'No file uploaded after processing.' });
            }

            // Upload the file from the temporary local path to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'krimoford', // Optional: Organizes images in your Cloudinary dashboard
                resource_type: 'image'
            });

            // ⭐ 4.3. CRITICAL CLEANUP STEP: Delete the temporary file from the local server disk
            fs.unlinkSync(req.file.path);

            // 4.4. Send back the secure URL for the React frontend to use
            res.status(201).json({
                message: 'Image uploaded successfully to Cloudinary.',
                url: result.secure_url,
                public_id: result.public_id
            });

        } catch (error) {
            // 4.5. Catch Cloudinary or other unexpected errors
            console.error('Cloudinary/Server Upload Error:', error);

            // Attempt to clean up the local file if the Cloudinary upload failed
            if (req.file && req.file.path && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            // The 500 error will likely originate here if credentials are bad
            return res.status(500).send({ message: `Cloudinary Upload Failed: ${error.message}` });
        }
    });
});

module.exports = router;