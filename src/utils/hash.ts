import { SALT } from "../configs";
import { compare, genSalt, hash } from "bcrypt";


export const hashPassword = async (password: string) => {
    const generateSalt = await genSalt(Number(SALT));
    return await hash(password, generateSalt);
};

export const comparePassword = async (
    password: string,
    hashPassword: string,
) => {
    return await compare(password, hashPassword);
};



