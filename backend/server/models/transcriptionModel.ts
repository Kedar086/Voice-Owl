import { Schema, model, Document } from "mongoose";

export interface ITranscription extends Document {
  audioUrl: string;
  transcription: string;
  createdAt: Date;
}

const transcriptionSchema = new Schema<ITranscription>({
  audioUrl: { type: String, required: true },
  transcription: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Transcription = model<ITranscription>(
  "Transcription",
  transcriptionSchema
);