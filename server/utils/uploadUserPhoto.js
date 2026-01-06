const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const uploadUserPhoto = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'ecommerceMern/users',
                transformation: [
                    { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                    { quality: 'auto:good' }
                ]
            },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

module.exports = uploadUserPhoto;
