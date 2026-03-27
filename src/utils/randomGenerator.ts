import { nanoid, customAlphabet } from "nanoid";

const REFERRAL_CODE_LENGTH = 3;
const TICKET_CODE_LENGTH = 6;
const CUSTOM_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function generateReferralCode(username: string){
    return `${username}${nanoid(REFERRAL_CODE_LENGTH)}`.toUpperCase();
}

export function generateVoucherCode(prefix: string){
    return `${prefix}-${nanoid(REFERRAL_CODE_LENGTH)}`.toUpperCase();
}

export function generateTicketCode(prefix: string){
    return `${prefix}-${customAlphabet(CUSTOM_ALPHABET, TICKET_CODE_LENGTH)()}`.toUpperCase();
}

