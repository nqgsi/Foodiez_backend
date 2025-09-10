import express from "express";
import { env } from "./Config/config";
import connectDB from "./database";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./Middleware/errorHandler";
import path from "path";
import { notFound } from "./Middleware/notFound";

connectDB();

const app = express();

app.use("/media", express.static(path.join(__dirname, "../media")));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(errorHandler);
app.use(notFound);

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
