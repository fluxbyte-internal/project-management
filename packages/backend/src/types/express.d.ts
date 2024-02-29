declare namespace Express {
    export interface Request {
        userId: string
        organisationId: string
        tenantId: string
    }
};