"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReferralCode = generateReferralCode;
exports.generateVoucherCode = generateVoucherCode;
exports.generateTicketCode = generateTicketCode;
const nanoid_1 = require("nanoid");
const REFERRAL_CODE_LENGTH = 3;
const TICKET_CODE_LENGTH = 6;
const CUSTOM_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function generateReferralCode(username) {
    return `${username}${(0, nanoid_1.nanoid)(REFERRAL_CODE_LENGTH)}`.toUpperCase();
}
function generateVoucherCode(prefix) {
    return `${prefix}-${(0, nanoid_1.nanoid)(REFERRAL_CODE_LENGTH)}`.toUpperCase();
}
function generateTicketCode(prefix) {
    return `${prefix}-${(0, nanoid_1.customAlphabet)(CUSTOM_ALPHABET, TICKET_CODE_LENGTH)()}`.toUpperCase();
}
