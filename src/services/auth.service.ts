import prisma from '../prisma';
import { findUserByUnique, createUser } from '../repositories/user.repository';
import { Decoded, LoginRequest, RegisterRequest } from '../types/auth.type';
import { createCustomError } from '../utils/error';
import { comparePassword, hashPassword } from '../utils/hash';
import { generateJWTToken } from '../utils/jwt';
import {
  generateReferralCode,
  generateVoucherCode,
} from '../utils/randomGenerator';
import { responseWithData, responseWithoutData } from '../utils/response';
import { AuthValidaton } from '../validations/auth.validation';
import { Validation } from '../validations/validation';


  export async function registerService(request: RegisterRequest) {
    const { email, isAdmin, password, username, referralCode } =
      Validation.validate(AuthValidaton.REGISTER, request);

    const userByUsername = await findUserByUnique({ username });
    if (userByUsername) {
      throw createCustomError(400, 'Username already exists!');
    }

    const userByEmail = await findUserByUnique({ email });
    if (userByEmail) throw createCustomError(400, 'Email already exists!');

    if (!isAdmin && referralCode) {
      const userByReferralCode = await findUserByUnique({
        referralCode,
      });

      if (!userByReferralCode) {
        throw createCustomError(400, 'Invalid referral code!');
      } else {
        await prisma.$transaction(async (tx) => {
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
          } else {
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
              password: await hashPassword(password),
              referralCode: isAdmin
                ? undefined
                : generateReferralCode(username.slice(0, 3)),
            },
          });

          await tx.voucher.create({
            data: {
              discount: 10,
              expiryDate: currentDate,
              maxUsage: 1,
              name: generateVoucherCode(userByReferralCode.referralCode!),

              user: { connect: { id: newUser.id } },
            },
          });
        });

        return responseWithoutData(201, true, 'Registration was successful');
      }
    }

    await createUser({
      email,
      isAdmin,
      username,
      password: await hashPassword(password),
      referralCode: isAdmin
        ? undefined
        : generateReferralCode(username.slice(0, 3)),
    });

    return responseWithoutData(201, true, 'Registration was successful');
  }

  export async function loginService(request: LoginRequest) {
    const { identity, password } = Validation.validate(
      AuthValidaton.LOGIN,
      request,
    );

    let findUser = null;
    const userByUsername = await findUserByUnique({
      username: identity,
    });
    if (!userByUsername) {
      const userByEmail = await findUserByUnique({
        email: identity,
      });
      findUser = userByEmail;
    }

    const user = userByUsername ? userByUsername : findUser;
    if (!user) throw createCustomError(404, 'Username or Email not exists!');

    const compare = await comparePassword(password, user.password);
    if (!compare) throw createCustomError(401, 'Password is wrong!');

    const token = generateJWTToken({ id: user.id, isAdmin: user.isAdmin });
    return responseWithData(200, true, 'Login was successful', {
      username: user.username,
      isAdmin: user.isAdmin,
      token,
    });
  }

  export async function keepLoginService(decoded: Decoded) {
    const token = generateJWTToken({
      id: decoded.id,
      isAdmin: decoded.isAdmin,
    });

    const user = await findUserByUnique({ id: decoded.id });
    if (!user) throw createCustomError(404, 'User not found!');

    return responseWithData(200, true, 'Keep login was successful', {
      username: user.username,
      isAdmin: user.isAdmin,
      token,
    });
  }
