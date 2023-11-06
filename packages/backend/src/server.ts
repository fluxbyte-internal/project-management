import "dotenv/config";
import express, { Application, Request, Response, NextFunction } from "express";
import "express-async-errors";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { settings } from "./config/settings.js";
import UserRoutes from "./routers/user.routes.js";
import AuthRoutes from "./routers/auth.routes.js";
import OrganisationRoutes from "./routers/organisation.routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { defualtHeaderMiddleware } from "./middleware/header.middleware.js";

const app: Application = express();

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
}));

//Cookie
app.use(cookieParser());

// Helmet configuration
app.use(helmet());

// JSON data handling
app.use(express.json());

app.set("json spaces", 2);

app.use(defualtHeaderMiddleware);

app.use("/api/auth", AuthRoutes);
app.use("/api/user", authMiddleware, UserRoutes);
app.use("/api/organisation", authMiddleware, OrganisationRoutes);

app.get("/", async (req: Request, res: Response) => {
  return res.status(200).send({ ok: true });
});

// Catch-all route should be placed after all other routes and middleware
app.use("*", (req: Request, res: Response) => {
  return res.status(404).send({ error: "Route not found" });
});

// Error handling middleware
app.use(function (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.error(error);
  return response.status(500).send(error?.message ?? "Something went wrong");
});

app.listen(settings.port, () =>
  console.log(`Server is listening on port ${settings.port}!`)
);
