import express from 'express';
import { getClientByTenantId } from '../config/db.js';
import { BadRequestError, SuccessResponse } from '../config/apiError.js';
import { StatusCodes } from 'http-status-codes';
import { createOrganisationSchema, organisationIdSchema } from '../schemas/organisationSchema.js';
import { UserRoleEnum } from '@prisma/client';

export const getOrganisationById = async (req: express.Request, res: express.Response) => {
  const organisationId = organisationIdSchema.parse(req.params.organisationId);
  const prisma = await getClientByTenantId(req.tenantId);
  const organisations = await prisma.organisation.findUniqueOrThrow({
    where: {
      organisationId: organisationId
    },
    include: {
      userOrganisation: {
        select: {
          userOrganisationId: true, jobTitle: true, role: true, taskColour: true, user: {
            select: { userId: true, email: true, firstName: true, lastName: true }
          }
        },
      }
    }
  });
  return new SuccessResponse(StatusCodes.OK, organisations, 'Organisation selected').send(res);
};

export const createOrganisation = async (req: express.Request, res: express.Response) => {
  const { organisationName, industry, status, country, listOfNonWorkingDays } = createOrganisationSchema.parse(req.body);
  if (!req.userId) { throw new BadRequestError('userId not found!!') };
  const prisma = await getClientByTenantId(req.tenantId);

  // CASE : One user can create only one organisation 
  const findOrganisation = await prisma.userOrganisation.findFirst({ where: { userId: req.userId } });
  if (findOrganisation) { throw new BadRequestError('Organisation is already created') };

  const organisation = await prisma.organisation.create({
    data: {
      organisationName: organisationName,
      industry: industry,
      status: status,
      listOfNonWorkingDays: listOfNonWorkingDays,
      country: country,
      tenantId: req.tenantId,
      createdBy: req.userId,
      userOrganisation: {
        create: {
          userId: req.userId,
          role: UserRoleEnum.ADMINISTRATOR
        }
      }
    }
  });
  return new SuccessResponse(StatusCodes.CREATED, organisation, 'Organisation created successfully').send(res);
};