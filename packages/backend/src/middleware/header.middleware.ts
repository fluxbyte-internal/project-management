import express from 'express';

export const defualtHeaderMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const tenantIdValue = req.headers["tenant-id"];
  const organisationIdvalue = req.headers["organisation-id"];
  req.tenantId = (tenantIdValue as string) ?? "root";
  // if (organisationIdvalue) {
  //   req.organisationId = Array.isArray(organisationIdvalue)
  //     ? organisationIdvalue
  //     : [organisationIdvalue as string];
  // }
  if (organisationIdvalue) req.organisationId = organisationIdvalue as string;
  next()
};