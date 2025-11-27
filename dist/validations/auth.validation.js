import { z } from "zod";
export class AuthValidaton {
    static REGISTER = z
        .object({
        username: z
            .string({
            required_error: 'Username is required!',
            invalid_type_error: 'Username is error',
        })
            .min(3, { message: 'Username must be at least 3 characters!' }),
        email: z
            .string({
            required_error: 'Email is required',
            invalid_type_error: 'Email must be a string',
        })
            .email({ message: 'Email format is invalid!' }),
        password: z
            .string({
            required_error: 'Password is required!',
            invalid_type_error: 'Password must be a string!',
        })
            .min(4, { message: 'Password must be at least 4 characters!' }),
        isAdmin: z.boolean({
            required_error: 'isAdmin is required!',
            invalid_type_error: 'isAdmin must be a boolean value!',
        }),
        referralCode: z
            .string({
            required_error: 'referral codi is required!',
            invalid_type_error: 'isAdmin must be a boolean value',
        })
            .min(6, { message: 'Referral code must be at least 6 characters!' })
            .optional(),
    })
        .refine((data) => {
        if (data.isAdmin && data.referralCode != undefined)
            return false;
        return true;
    }, {
        message: 'Admin cannot provide a referral code!',
        path: ['referralCode'],
    });
    static LOGIN = z.object({
        identity: z
            .string({
            required_error: 'identity is required!',
            invalid_type_error: 'Identity must be a string!',
        })
            .min(3, { message: 'Identity must be at least 3 characters' }),
        passwor: z
            .string({
            required_error: 'password is required!',
            invalid_type_error: 'identity must be a string!',
        })
            .min(4, { message: 'Password must be at least 4 characters' }),
    });
}
