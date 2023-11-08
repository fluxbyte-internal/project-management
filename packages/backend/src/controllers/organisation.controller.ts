import express from 'express';
import { getClientByTenantId } from '../config/db.js';
import { BadRequestError, SuccessResponse } from '../config/apiError.js';
import { StatusCodes } from 'http-status-codes';
import { createOrganisationSchema, organisationIdSchema } from '../schemas/organisationSchema.js';
import { UserRoleEnum } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';
import { PRISMA_ERROR_CODE } from '../constants/prismaErrorCodes.js';

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
  try {
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
    })
    return new SuccessResponse(StatusCodes.CREATED, organisation, 'Organisation created successfully').send(res);
  } catch (error) {
    console.error(error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PRISMA_ERROR_CODE.CANNOT_CREATE) {
        throw new BadRequestError(`A new Organisation cannot be created`);
      }
    }
  }
};