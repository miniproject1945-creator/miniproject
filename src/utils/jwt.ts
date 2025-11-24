import { JWT_SECRET } from "@/configs";
import {sign, verify} from "jsonwebtoken";

export function generateJWTToken(payload: any): string{
    return sign(payload, JWT_SECRET);
}

export function verifyJWTToken(token: string): any {
    return verify(token, JWT_SECRET);
}





