import { PrismaClient } from "@prisma/client"
const prismaClients: Record<'root' | Omit<string, 'root'> & string, PrismaClient> = {
  root: new PrismaClient(),
};

export async function getClientByTenantId(tenantId: string): Promise<PrismaClient> {
  if (!tenantId) { return prismaClients.root };

  const findTenant = await prismaClients.root?.tenant.findUnique({
    where: { tenantId: tenantId },
  });

  if (!findTenant) { return prismaClients.root };

  prismaClients[tenantId] = new PrismaClient({
    datasourceUrl: findTenant.connectionString!
  });

  return prismaClients[tenantId] as PrismaClient;
};