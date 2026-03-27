import { SALT } from "@/configs";
import { compare, genSalt, hash } from "bcrypt";
export const hashPassword = async (password) => {
    const generateSalt = await genSalt(Number(SALT));
    return await hash(password, generateSalt);
};
export const comparePassword = async (password, hashPassword) => {
    return await compare(password, hashPassword);
};
