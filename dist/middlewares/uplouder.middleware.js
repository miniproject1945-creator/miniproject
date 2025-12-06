"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploader = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = require("path");
const uploader = (dirName, filePrefix) => {
    const defaultDir = (0, path_1.join)(__dirname, '../../public/assets');
    const configStore = multer_1.default.diskStorage({
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
    return (0, multer_1.default)({ storage: configStore });
};
exports.uploader = uploader;
