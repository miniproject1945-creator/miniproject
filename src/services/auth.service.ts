import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../lib/prisma";
import path from "path";
import fs from "fs";
import { compile } from "handlebars";
import { sign } from "jsonwebtoken";
import { compareSync, genSaltSync, hashSync } from "bcrypt";


import { getRegisterToken } from "./registerToken.service";
import { BASE_WEB_URL, SECRET_KEY } from "../configs/env.configs";
import { createCustomError } from "../utils/customError";
import { transporter } from "../helpers/nodemailer";
import { generateReferralCode } from "@/utils/generateReferralCode";

interface RegisterDTO {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  referral?: string;
}


export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (err) {
    throw err;
  }
}


export async function getUserByReferral(referral: string) {
  try {
    const user = await prisma.referral.findUnique({
      where: {
        referralCode: referral,
      },
    });
    return user;
    
  } catch (err) {
    throw err;
  }
}


export async function verificationLinkService(email: string) {
  const targetPath = path.join(__dirname, "../templates", "registration.hbs");
  try {
    const user = await getUserByEmail(email);
    if (user) throw createCustomError(401, "User already exists");
    const payload = {
      email,
    };

    const token = sign(payload, SECRET_KEY, { expiresIn: "5m" });

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.regisToken.create({
        data: {
          token,
        },
      });

      const templateSrc = fs.readFileSync(targetPath, "utf-8");
      const compiledTemplate = compile(templateSrc);

      const html = compiledTemplate({
        redirect_url: `${BASE_WEB_URL}/auth/verify?token=${token}`,
      });

      await transporter.sendMail({
        to: email,
        subject: "Registration",
        html,
      });
    });
  } catch (err) {
    throw err;
  }
}


export async function verifyService(
  referral: string,
  token: string,
  params: RegisterDTO
) {
  try {
    
    const tokenExist = await getRegisterToken(token);
    if (!tokenExist) throw createCustomError(403, "Invalid Token");

    
    const referralExist = await getUserByReferral(referral);
    if (!referralExist) throw createCustomError(401, "Invalid Referral");


    const existedUser = await getUserByEmail(params.email);
    if (existedUser) throw createCustomError(401, "User already exists");

    
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(params.password, salt);


    await prisma.$transaction(async (tx) => {
      
      const newUser = await tx.user.create({
        data: {
          firstname: params.firstname,
          lastname: params.lastname,
          email: params.email,
          password: hashedPassword,
          referredById: referralExist.userId,
        },
      });

      
      const referralCode = await generateReferralCode();

      await tx.referral.create({
        data: {
          userId: newUser.id,
          referralCode: referralCode,
        },
      });

      
      await tx.regisToken.delete({
        where: { token },
      });
    });

    return { message: "Registration & referral creation success" };
  } catch (err) {
    throw err;
  }
}


export async function Login( email: string, password: string){
    try {
        const user = await getUserByEmail(email);
        if(!user) 
            throw createCustomError(401, "invalid email or password");
        const isValidPassword = compareSync(password, user.password);
        if(!isValidPassword)
            throw createCustomError (401, "invalid email or password");

        const payload = {
            email: user.email,
            firstName : user.firstname,
            lastName : user.lastname,
            role : user,
        }

        const accessToken = sign(payload, SECRET_KEY, {expiresIn: "10m"});
        const refreshToken = sign(payload, SECRET_KEY, {expiresIn: "30d"});
        
        return {
            accessToken,
            refreshToken,
        }

    } catch (err) {
        throw err;
    }
};

