import { nanoid, customAlphabet } from "nanoid";
const REFERRAL_CODE_LENGTH = 3;
const TICKET_CODE_LENGTH = 6;
const CUSTOM_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export function generateReferralCode(username) {
    return `${username}${nanoid(REFERRAL_CODE_LENGTH)}`.toUpperCase();
}
export function generateVoucherCode(prefix) {
    return `${prefix}-${nanoid(REFERRAL_CODE_LENGTH)}`.toUpperCase();
}
export function generateTicketCode(prefix) {
    return `${prefix}-${customAlphabet(CUSTOM_ALPHABET, TICKET_CODE_LENGTH)()}`.toUpperCase();
}
