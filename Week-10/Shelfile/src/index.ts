import express from "express";
import authRouter from "./routes/auth.routes";
import householdRouter from "./routes/household.routes";
import itemRouter from "./routes/item.routes";
import authMiddleware from "./middleware/auth.middleware";
import "./models";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Shelfile API is running",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/households", authMiddleware, householdRouter);
app.use("/api/items", authMiddleware, itemRouter);

export default app;
