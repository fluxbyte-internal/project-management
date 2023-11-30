import { getClientByTenantId } from "../config/db.js";

export class OtpService {
  static async saveOTP(userOtp: string, userId: string, tanentId: string, expiresSecond = 60 * 5) {
    const prisma = await getClientByTenantId(tanentId);
    return await prisma.userOTP.create({
      data: {
        userId: userId,
        otp: userOtp,
        isUsed: false,
        expiryTime: new Date(new Date().getTime() + expiresSecond * 1000),
      }
    })
  }
  static async verifyOTP(userOtp: string, userId: string, tanentId: string) {
    const prisma = await getClientByTenantId(tanentId);
    const findOtp = await prisma.userOTP.findFirst({
      where: {
        userId: userId,
        otp: userOtp,
        expiryTime: {
          gt: new Date()
        }
      }
    });
    if (findOtp) {
      await prisma.user.update({
        where: { userId: findOtp.userId },
        data: {
          isVerified: true,
          userOtp: {
            update: {
              where: { otpId: findOtp.otpId },
              data: {
                isUsed: true,
              }
            }
          }
        }
      })
      return true;
    } return false;
  }
};