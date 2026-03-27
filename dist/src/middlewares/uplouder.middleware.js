import multer from 'multer';
import { join } from 'path';
export const uploader = (dirName, filePrefix) => {
    const defaultDir = join(__dirname, '../../public/assets');
    const configStore = multer.diskStorage({
        destination: (req, file, cb) => {
            const fileDestination = dirName ? defaultDir + dirName : defaultDir;
            cb(null, fileDestination);
        },
        filename: (req, file, cb) => {
            const existName = file.originalname.split('.');
            const extension = existName[existName.length - 1];
            if (filePrefix) {
                const newName = filePrefix + Date.now() + '.' + extension;
                cb(null, newName);
            }
            else {
                cb(null, file.originalname);
            }
        },
    });
    return multer({ storage: configStore });
};
