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
  const consumedBudgetNumber = parseFloat(project.consumedBudget);
  return (progressionPercentage * estimatedBudgetNumber) / consumedBudgetNumber;
}
