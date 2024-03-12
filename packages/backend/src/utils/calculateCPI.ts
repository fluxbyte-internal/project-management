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
  const estimatedBudgetNumber = parseFloat(project.estimatedBudget);
  let consumedBudgetNumber = parseFloat(project.consumedBudget);
  consumedBudgetNumber = consumedBudgetNumber === 0 ? NaN : consumedBudgetNumber;
  const finalValue = (progressionPercentage * estimatedBudgetNumber) / consumedBudgetNumber
  return finalValue;
}
