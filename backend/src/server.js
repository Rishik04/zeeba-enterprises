import * as env from "dotenv";
env.config();

import cors from "cors";
import express from "express";
import projectRouter from "./controller/project.controller.js";
import userRouter from "./controller/user.controller.js";
import connectDB from "./db/db.js";
import path from "path";

connectDB();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
