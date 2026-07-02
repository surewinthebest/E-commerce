import multer from "multer";
import path from "path";

export const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()} - ${file.originalname}`)
    }
})

//filefilter: jpeg,jpg,png,webp
const fileFilter = (req, file, cb) => {
    const allowedType = /jpeg|jpg|png|webp/;
    const extname = allowedType.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimetype = allowedType.test(file.mimetype);;

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed (jpeg, jpg, png, webp)"))
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } //5MB limit
})
