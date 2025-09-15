import express from "express";
import transcriptionRoutes from "./routes/transcriptionRoutes";

const app = express();

app.use(express.json());
app.use("/api", transcriptionRoutes);

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.get("/", (_req, res) => res.json( {greet: 'Welcome to Voice Owl' }));

export default app;