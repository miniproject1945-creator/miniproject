"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletfile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const deletfile = (path, fileName) => {
    fs_1.default.unlinkSync((0, path_1.join)(__dirname, `${path}/${fileName}`));
};
exports.deletfile = deletfile;
