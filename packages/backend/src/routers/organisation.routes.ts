import express from 'express';
import * as OrganisationControlller from '../controllers/organisation.controller.js';


let router = express.Router();

router.get('/:organisationId', OrganisationControlller.getOrganisationById);
router.post('/', OrganisationControlller.createOrganisation);

export default router;