"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerService = registerService;
exports.loginService = loginService;
exports.keepLoginService = keepLoginService;
const prisma_1 = __importDefault(require("../prisma"));
const user_repository_1 = require("../repositories/user.repository");
const error_1 = require("../utils/error");
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
const randomGenerator_1 = require("../utils/randomGenerator");
const response_1 = require("../utils/response");
const auth_validation_1 = require("../validations/auth.validation");
const validation_1 = require("../validations/validation");
async function registerService(request) {
    const { email, isAdmin, password, username, referralCode } = validation_1.Validation.validate(auth_validation_1.AuthValidaton.REGISTER, request);
    const userByUsername = await (0, user_repository_1.findUserByUnique)({ username });
    if (userByUsername) {
        throw (0, error_1.createCustomError)(400, 'Username already exists!');
    }
    const userByEmail = await (0, user_repository_1.findUserByUnique)({ email });
    if (userByEmail)
        throw (0, error_1.createCustomError)(400, 'Email already exists!');
    if (!isAdmin && referralCode) {
        const userByReferralCode = await (0, user_repository_1.findUserByUnique)({
            referralCode,
        });
        if (!userByReferralCode) {
            throw (0, error_1.createCustomError)(400, 'Invalid referral code!');
        }
        else {
            await prisma_1.default.$transaction(async (tx) => {
                const currentDate = new Date();
                currentDate.setMonth(currentDate.getMonth() + 3);
                if (!userByReferralCode.point) {
                    await tx.point.create({
                        data: {
                            balance: 10000,
                            expiryDate: currentDate,
                            user: { connect: { id: userByReferralCode.id } },
                        },
                    });
                }
                else {
                    await tx.point.update({
                        data: {
                            balance: userByReferralCode.point.balance + 10000,
                            expiryDate: currentDate,
                        },
                        where: { id: userByReferralCode.point.id },
                    });
                }
                const newUser = await tx.user.create({
                    data: {
                        email,
                        isAdmin,
                        username,
                        password: await (0, hash_1.hashPassword)(password),
                        referralCode: isAdmin
                            ? undefined
                            : (0, randomGenerator_1.generateReferralCode)(username.slice(0, 3)),
                    },
                });
                await tx.voucher.create({
                    data: {
                        discount: 10,
                        expiryDate: currentDate,
                        maxUsage: 1,
                        name: (0, randomGenerator_1.generateVoucherCode)(userByReferralCode.referralCode),
                        user: { connect: { id: newUser.id } },
                    },
                });
            });
            return (0, response_1.responseWithoutData)(201, true, 'Registration was successful');
        }
    }
    await (0, user_repository_1.createUser)({
        email,
        isAdmin,
        username,
        password: await (0, hash_1.hashPassword)(password),
        referralCode: isAdmin
            ? undefined
            : (0, randomGenerator_1.generateReferralCode)(username.slice(0, 3)),
    });
    return (0, response_1.responseWithoutData)(201, true, 'Registration was successful');
}
async function loginService(request) {
    const { identity, password } = validation_1.Validation.validate(auth_validation_1.AuthValidaton.LOGIN, request);
    let findUser = null;
    const userByUsername = await (0, user_repository_1.findUserByUnique)({
        username: identity,
    });
    if (!userByUsername) {
        const userByEmail = await (0, user_repository_1.findUserByUnique)({
            email: identity,
        });
        findUser = userByEmail;
    }
    const user = userByUsername ? userByUsername : findUser;
    if (!user)
        throw (0, error_1.createCustomError)(404, 'Username or Email not exists!');
    const compare = await (0, hash_1.comparePassword)(password, user.password);
    if (!compare)
        throw (0, error_1.createCustomError)(401, 'Password is wrong!');
    const token = (0, jwt_1.generateJWTToken)({ id: user.id, isAdmin: user.isAdmin });
    return (0, response_1.responseWithData)(200, true, 'Login was successful', {
        username: user.username,
        isAdmin: user.isAdmin,
        token,
    });
}
async function keepLoginService(decoded) {
    const token = (0, jwt_1.generateJWTToken)({
        id: decoded.id,
        isAdmin: decoded.isAdmin,
    });
    const user = await (0, user_repository_1.findUserByUnique)({ id: decoded.id });
    if (!user)
        throw (0, error_1.createCustomError)(404, 'User not found!');
    return (0, response_1.responseWithData)(200, true, 'Keep login was successful', {
        username: user.username,
        isAdmin: user.isAdmin,
        token,
    });
}
