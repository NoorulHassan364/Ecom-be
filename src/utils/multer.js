const multer = require("multer");
const sharp = require('sharp');
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
//  ...............multer start.............

// without image processing

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, `${__dirname}/../uploads`);
//   },
//   filename: (req, file, cb) => {
//     // let fileName = file.originalname.split(' ').join('-');
//     // cb(null, Date.now().toString() + '-' + fileName);
//     let ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
//   }
// });


// with image processing 
// const multerStorage = multer.memoryStorage();

// exports.resizeUserPhoto = (req, res, next) => {
//     console.log(__dirname)
//     if (!req.file) {
//         return next();
//     }
//     req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

//     sharp(req.file.buffer)
//         .resize(500, 500)
//         .toFormat('jpeg')
//         .jpeg({ quality: 90 })
//         .toFile(`${__dirname}/../uploads/${req.file.filename}`)
//     next()
// }

// // user can only upload images 
// const multerFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image')) {
//         cb(null, true);
//     } else {
//         cb(new appError("Not an image!please upload an image", 400), false)
//     }
// }

// const upload = multer({
//     storage: multerStorage,
//     fileFilter: multerFilter
// })

// exports.uploadUserPhoto = upload.single('photo')


const getS3 = () => {
    const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_KEY } = process.env;

    const myConfig = new AWS.Config({
        region: AWS_REGION,
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_KEY,
        signatureVersion: "v4",
    });

    return new AWS.S3(myConfig);
};
exports.getS3 = getS3;


exports.multerUploadS3 = multer({
    storage: multerS3({
        s3: getS3(),
        bucket: 'tours-ecommerce',
        acl: "public-read",
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(
                null,
                Date.now().toString() + "-" + file.originalname.split(" ").join("-")
            );
        },
    }),
});