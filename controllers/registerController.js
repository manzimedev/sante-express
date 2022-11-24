import multer from 'multer';
import sharp from 'sharp';

import factory from "./handlerFactory.js";
import Register from "../models/registerModel.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Seules les images sont autorisées.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

const uploadVisitorPhoto = upload.single('photo');

const resizeVisitorPhoto = catchAsync(async (req, res, next) => {
  console.log(req.file)
  if (!req.file) return next();

  req.file.filename = `visitor-${req.body.prenom}-${req.body.nom}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({quality: 90})
      .toFile(`public/imgs/visitors/${req.file.filename}`);

  next();
});

const getFile = (req,res,next)=> {
  if (req.file) req.body.photo = req.file.filename;
  next()
}

const createOne = factory.createOne(Register);

export default {
  createOne,
  uploadVisitorPhoto,
  resizeVisitorPhoto,
  getFile
};
