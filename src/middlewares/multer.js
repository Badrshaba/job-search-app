
import multer from "multer"





export const multerMiddleHost = (extensions) => {

    // diskStorage
    const storage = multer.diskStorage({
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    })

    // file Filter
    const fileFilter = (req, file, cb) => {
        if (extensions.includes(file.mimetype.split('/')[1])) {
            return cb(null, true)
        }
        cb(new Error('file format is not allowed!'), false)
    }


    const file = multer({ fileFilter, storage })
    return file
}