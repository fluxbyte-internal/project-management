import { HistoryTypeEnum } from "@prisma/client";
import { getClientByTenantId } from "../config/db.js";

export class HistoryService {
  static async createHistory(
    userId: string,
    tenantId: string,
    historyType: HistoryTypeEnum,
    historyMesage: string,
    historyData: { oldValue?: string; newValue?: string } | any,
    historyRefrenceId: string
  ) {
    try {
      const prisma = await getClientByTenantId(tenantId);
      const history = await prisma.history.create({
        data: {
          type: historyType,
          data: historyData,
          createdBy: userId,
          referenceId: historyRefrenceId,
          message: historyMesage,
        },
      });
      return history;
    } catch (error) {
      console.error(error);
    }
  }
}
