import multer from "multer";
import path from "path";

export const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname || "").toLowerCase();
        const safeExt = [".jpeg", ".jpg", "png", "webp"].includes(ext) ? ext : "";
        const unique = `${Date.now()} - ${Math.round(Math.random() *1e9)}`;
        cb(null, `${unique}${safeExt}`)
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
