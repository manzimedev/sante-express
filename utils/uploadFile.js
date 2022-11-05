import multer from 'multer';
import AppError from "./AppError.js";
import sharp from "sharp";

const uploadPhoto = ()=>{
    const multerStorage = multer.memoryStorage();

    const multerFilter = (req, file, cb) => {

        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new AppError('Not an image! Please upload only images.', 400), false);
        }
    };

    return multer({
        storage: multerStorage,
        fileFilter: multerFilter
    })
}

const resizePhoto = async (req, folder, id, width, height, quality)=>{
        const files = req.files.map(async (file, index)=>{
            const filename = `${folder}-${id}-${Date.now()}-${index}.jpeg`;
            await sharp(file.buffer)
                .resize(width, height)
                .toFormat('jpeg')
                .jpeg({quality})
                .toFile(`public/imgs/${folder}/${filename}`);

            return filename
        })

        req.body.filenames = await Promise.all(files)
}

export default {
    uploadPhoto,
    resizePhoto
}