import { JWT_SECRET } from "@/configs";
import { sign, verify } from "jsonwebtoken";
export function generateJWTToken(payload) {
    return sign(payload, JWT_SECRET);
}
export function verifyJWTToken(token) {
    return verify(token, JWT_SECRET);
}
