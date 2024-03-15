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
    organisationId,
  );
  const consumedBudget =
    project.consumedBudget === "0" ? NaN : Number(project.consumedBudget);
  const estimatedBudgetNumber = Math.round(Number(project.estimatedBudget));
  const finalValue =
    (progressionPercentage * estimatedBudgetNumber) /
    Math.round(consumedBudget);
  return finalValue;
}
