"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decreamentDate = exports.increamentDate = void 0;
const increamentDate = (date, days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};
exports.increamentDate = increamentDate;
const decreamentDate = (date, days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - days);
    return newDate;
};
exports.decreamentDate = decreamentDate;
