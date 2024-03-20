import { Project } from "@prisma/client";
import { getClientByTenantId } from "../config/db.js";

export async function calculationCPI(
  project: Project,
  tenantId: string,
  organisationId: string
) {
  const prisma = await getClientByTenantId(tenantId);
  const progressionPercentage = await prisma.project.projectProgression(
    project.projectId,
    tenantId,
    organisationId
  );
  const consumedBudget =
    project.consumedBudget === "0" ? NaN : Number(project.consumedBudget);
  const estimatedBudgetNumber = Number(project.estimatedBudget);
  const finalValue =
    (Math.round(progressionPercentage * 100) * estimatedBudgetNumber) /
    consumedBudget /
    100;
  return finalValue;
}
