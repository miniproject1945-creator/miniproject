import nodemailer from "nodemailer";
import { GMAIL_EMAIL, GMAIL_APP_PASS } from "../configs/env.configs";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_EMAIL,
    pass: GMAIL_APP_PASS,
  },
});
