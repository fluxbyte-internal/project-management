import "dotenv/config";
import express, { Application, Request, Response } from "express";
import "express-async-errors";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { settings } from "./config/settings.js";
import UserRoutes from "./routers/user.routes.js";
import AuthRoutes from "./routers/auth.routes.js";
import OrganisationRoutes from "./routers/organisation.routes.js";
import ProjectRoutes from "./routers/project.routes.js";
import TaskRoutes from "./routers/task.routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { defualtHeaderMiddleware } from "./middleware/header.middleware.js";
import { ErrorHandlerMiddleware } from "./middleware/error.middleware.js";
import morgan from "morgan";
import passport from "passport";
import "./services/passport.services.js";
import fileUpload from "express-fileupload";
// import compression from 'compression';

const app: Application = express();

// compression
// app.use(compression());


// File-upload
app.use(fileUpload());

// Morgan
app.use(
  morgan(
    ":method \x1b[32m:url\x1b[0m :status \x1b[36m(:response-time ms)\x1b[0m - \x1b[35m:res[content-length] :res[compressed-size] \x1b[0m"
  )
);

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(passport.initialize());

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
app.use("/api/project", authMiddleware, ProjectRoutes);
app.use("/api/task", authMiddleware, TaskRoutes);

app.get("/", async (req: Request, res: Response) => {
  return res.status(200).send({ ok: true });
});

// Catch-all route should be placed after all other routes and middleware
app.use("*", (req: Request, res: Response) => {
  return res.status(404).send({ error: "Route not found" });
});

// Error handling middleware
app.use(ErrorHandlerMiddleware.handler);

app.listen(settings.port, () =>
  console.log(`Server is listening on port ${settings.port}!`)
);
