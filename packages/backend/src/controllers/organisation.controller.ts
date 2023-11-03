import express from 'express';
import { Prisma } from "@prisma/client";
import { sendResponse } from '../config/helper.js';
import { getClientByTenantId } from '../config/db.js';
import { STATUS_CODES } from '../constants/constants.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';
import { PRISMA_ERROR_CODE } from '../constants/prismaErrorCodes.js';

export const getOrganisationById = async (req: express.Request, res: express.Response) => {
  const organisationId = req.params.organisationId;
  if (!organisationId) return sendResponse(res, STATUS_CODES.BAD_REQUEST, 'Please provide organisationId!');
  try {
    const prisma = await getClientByTenantId(req.tenantId);
    const organisations = await prisma?.organisation.findUniqueOrThrow({
      where: {
        organisationId: organisationId
      }
    })
    return sendResponse(res, STATUS_CODES.OK, 'Organisation selected', organisations);
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PRISMA_ERROR_CODE.NOT_FOUND) {
        return sendResponse(res, STATUS_CODES.NOT_FOUND, `Organisation with id ${organisationId} not found`);
      }
    }
  }
};

export const createOrganisation = async (req: express.Request, res: express.Response) => {
  const { organisationName, industry, status, country, listOfNonWorkingDays }: Prisma.OrganisationCreateInput = req.body;
  try {
    const prisma = await getClientByTenantId(req.tenantId);
    const organisations = await prisma?.organisation.create({
      data: {
        organisationName: organisationName,
        industry: industry,
        status: status,
        listOfNonWorkingDays: listOfNonWorkingDays,
        country: country,
        tenantId: req.tenantId
      }
    });
    return sendResponse(res, STATUS_CODES.CREATED, 'Organisation created successfully', organisations);
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PRISMA_ERROR_CODE.CANNOT_CREATE) {
        return sendResponse(res, STATUS_CODES.BAD_REQUEST, `A new Organisation cannot be created`);
      }
    }
  }
};