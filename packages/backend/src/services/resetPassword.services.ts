import { getClientByTenantId } from "../config/db.js";
import { encrypt } from "../utils/encryption.js";

export class ResetPassword {
  static async saveUserResetToken(tanentId: string, token: string, userId: string, expiryTime: Date) {
    const prisma = await getClientByTenantId(tanentId);
    return await prisma.resetPassword.create({
      data: {
        isUsed: false,
        token: token,
        userId: userId,
        expiryTime: expiryTime
      }
    });
  };

  static async verifyUserResetToken(tanentId: string, token: string, password: string) {
    const prisma = await getClientByTenantId(tanentId);
    let resetPasswordRecord = await prisma.resetPassword.findFirst({
      where: {
        token: token,
        expiryTime: {
          gt: new Date()
        }
      }
    });
    if (!resetPasswordRecord) { return false };
    const hashedPassword = await encrypt(password);
    await prisma.resetPassword.update({
      where: {
        resetPasswordId: resetPasswordRecord.resetPasswordId, userId: resetPasswordRecord.userId
      },
      data: {
        isUsed: true,
        user: {
          update: {
            password: hashedPassword
          }
        }
      }
    });
    return true;
  };
};
