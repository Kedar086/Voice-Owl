import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../src/app";
import { connectDB } from "../src/config/db";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await connectDB(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

describe("Transcription API", () => {
  it("should create a transcription", async () => {
    const res = await request(app)
      .post("/api/transcription")
      .send({ audioUrl: "https://example.com/sample.mp3" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  it("should return 400 if audioUrl missing", async () => {
    const res = await request(app).post("/api/transcription").send({});
    expect(res.status).toBe(400);
  });

  it("should list transcriptions", async () => {
    await request(app)
      .post("/api/transcription")
      .send({ audioUrl: "https://example.com/sample.mp3" });
    const res = await request(app).get("/api/transcriptions");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});