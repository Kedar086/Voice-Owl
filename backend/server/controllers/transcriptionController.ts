import { Request, Response } from "express";
import { TranscriptionService } from "../services/transcriptionService";

export const createTranscription = async (req: Request, res: Response) => {
  try {
    const { audioUrl } = req.body as { audioUrl?: string };
    if (!audioUrl) {
      return res.status(400).json({ error: "audioUrl is required" });
    }

    const record = await TranscriptionService.processTranscription(audioUrl);
    return res.status(201).json({ id: record._id });
  } catch (err: any) {
    console.error("createTranscription error:", err?.message ?? err);
    if (err?.message === "Invalid audioUrl") {
      return res.status(400).json({ error: "Invalid audioUrl" });
    }
    if (err?.message?.includes("URL not reachable")) {
      return res.status(502).json({ error: "Audio URL is not reachable" });
    }
    return res.status(500).json({ error: "Server error" });
  }
};

export const listTranscriptions = async (_req: Request, res: Response) => {
  try {
    const rows = await TranscriptionService.listAll();
    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};