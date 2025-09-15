import { Router } from "express";
import { createTranscription, listTranscriptions } from "../controllers/transcriptionController";

const router = Router();

router.post("/transcription", createTranscription);
router.get("/transcriptions", listTranscriptions);

export default router;