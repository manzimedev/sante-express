import multer from 'multer';
import sharp from 'sharp';

import User from './../models/UserModel.js';
import catchAsync from './../utils/catchAsync.js';
import AppError from './../utils/appError.js';
import factory from './handlerFactory.js';

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

const uploadUserPhoto = upload.single('photo');

const resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public/imgs/users/${req.file.filename}`);

    next();
});

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj)
        .forEach(el => {
            if (allowedFields.includes(el)) newObj[el] = obj[el];
        });
    return newObj;
};

const getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

const updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /updateMyPassword.',
                400
            )
        );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'firstName', 'lastName', 'email', 'phone');
    if (req.file) filteredBody.photo = req.file.filename;

    // 3) Update user document
    const updatedUser = await User.update(filteredBody, {
        where: {
            id: req.user.id,
        }
    });

    res.status(200)
        .json({
            status: 'success',
            data: {
                user: updatedUser
            }
        });
});

const deleteMe = catchAsync(async (req, res, next) => {
    await User.update({active: false}, {
        where: {
            id: req.user.id
        }
    });

    res.status(204)
        .json({
            status: 'success',
            data: null
        });
});

const createUser = (req, res) => {
    res.status(500)
        .json({
            status: 'error',
            message: 'This route is not defined! Please use /signup instead'
        });
};

const getUser = factory.getOne(User);
const getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
const updateUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);

export default {
    getUser,
    getAllUsers,
    updateUser,
    deleteUser,
    createUser,
    deleteMe,
    uploadUserPhoto,
    resizeUserPhoto,
    getMe,
    updateMe
}