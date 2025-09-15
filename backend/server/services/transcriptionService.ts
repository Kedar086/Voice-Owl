import { Transcription, ITranscription } from "../models/transcriptionModel";
import { withRetry, checkUrlReachable } from "../utils/retryDownload";
import dotenv from "dotenv";

dotenv.config();

const RETRY_COUNT = parseInt(process.env.DOWNLOAD_RETRY_COUNT || "3", 10);
const BASE_MS = parseInt(process.env.DOWNLOAD_RETRY_BASE_MS || "300", 10);

export class TranscriptionService {
  static async processTranscription(audioUrl: string): Promise<ITranscription> {
    try {
      new URL(audioUrl);
    } catch {
      throw new Error("Invalid audioUrl");
    }

    await withRetry(
      async () => {
        const ok = await checkUrlReachable(audioUrl);
        if (!ok) throw new Error("URL not reachable (non-2xx)");
        return ok;
      },
      { attempts: RETRY_COUNT, baseDelayMs: BASE_MS }
    );

    const dummyTranscription = "transcribed text";

    const record = new Transcription({
      audioUrl,
      transcription: dummyTranscription
    });

    await record.save();
    return record;
  }

  static async listAll(): Promise<ITranscription[]> {
    return Transcription.find().sort({ createdAt: -1 }).exec();
  }
}