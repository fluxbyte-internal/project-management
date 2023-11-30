import express from 'express';
import { getClientByTenantId } from '../config/db.js';
import { BadRequestError, ForbiddenError, NotFoundError, SuccessResponse } from '../config/apiError.js';
import { StatusCodes } from 'http-status-codes';
import { createOrganisationSchema, organisationIdSchema, updateOrganisationSchema } from '../schemas/organisationSchema.js';
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
  const { organisationName, industry, status, country, nonWorkingDays } = createOrganisationSchema.parse(req.body);
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
      country: country,
      tenantId: req.tenantId,
      createdByUserId: req.userId,
      updatedByUserId: req.userId,
      userOrganisation: {
        create: {
          userId: req.userId,
          role: UserRoleEnum.ADMINISTRATOR
        }
      },
      nonWorkingDays: nonWorkingDays
    },
  });
  return new SuccessResponse(StatusCodes.CREATED, organisation, 'Organisation created successfully').send(res);
};

export const updateOrganisation = async (req: express.Request, res: express.Response) => {
  if (!req.userId) { throw new BadRequestError('userId not found!') };
  const organisationId = organisationIdSchema.parse(req.params.organisationId);
  const updateOrganisationValue = updateOrganisationSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);

  const organisation = await prisma.organisation.findFirst({
    where: {
      organisationId: organisationId,
    },
    include: {
      userOrganisation: true
    }
  });

  if (!organisation) throw new NotFoundError('Organisation not found')

  if (!organisation.userOrganisation.some(uo =>
    uo.userId === req.userId && UserRoleEnum.ADMINISTRATOR == uo.role)
  ) {
    throw new ForbiddenError();
  };

  let updateObj = { ...updateOrganisationValue, updatedByUserId: req.userId };
  const organisationUpdate = await prisma.organisation.update({
    where: {
      organisationId: organisationId,
      userOrganisation: {
        some: {
          role: UserRoleEnum.ADMINISTRATOR,
        }
      }
    },
    data: { ...updateObj },
  });
  return new SuccessResponse(StatusCodes.OK, organisationUpdate, 'Organisation updated successfully').send(res);
};