import express from 'express';
import * as OrganisationControlller from '../controllers/organisation.controller.js';


let router = express.Router();

router.get('/:organisationId', OrganisationControlller.getOrganisationById);
router.post('/', OrganisationControlller.createOrganisation);
router.post('/:organisationId/user', OrganisationControlller.addOrganisationMember);
router.put('/:userOrganisationId', OrganisationControlller.changeMemberRole);
router.delete('/:userOrganisationId', OrganisationControlller.removeOrganisationMember);
router.put('/:organisationId', OrganisationControlller.updateOrganisation);

export default router;