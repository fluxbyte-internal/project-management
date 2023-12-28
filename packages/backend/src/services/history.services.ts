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
          historyType: historyType,
          historyData: historyData,
          historyCreatedBy: userId,
          historyReferenceId: historyRefrenceId,
          historyMessage: historyMesage,
        },
      });
      return history;
    } catch (error) {
      console.error(error);
    }
  }
}
