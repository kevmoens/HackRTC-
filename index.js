import { config } from "dotenv";
config();

import express, { json, urlencoded } from "express";
import { AccessToken } from "livekit-server-sdk";
import cors from "cors";
import vision from "@google-cloud/vision";
import { connect } from "mongoose";
import { Room } from "./room.js";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(json({ limit: "50mb" }));
app.use(urlencoded({ extended: true, limit: "50mb" }));

const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected!`);
  } catch (error) {
    throw new Error(error);
  }
};

await connectDB();

const generateRandomString = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
};

app.get("/", async (_, res) => res.json({ message: "Hello World!" }));

app.get("/token", async (req, res) => {
  try {
    const { username, room } = req.query;
    const roomName = room == "null" ? generateRandomString() : room;
    const at = new AccessToken(process.env.apiKey, process.env.apiKeySecret, {
      identity: username,
    });
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canSubscribe: true,
      canPublish: true,
    });

    return res.json({ token: at.toJwt(), roomName });
  } catch (error) {
    return res.json(error);
  }
});

app.post("/vision", async (req, res) => {
  const { imgStr, itemName, userToken, roomName } = req.body;

  try {
    const client = new vision.ImageAnnotatorClient({
      keyFilename: "./key.json",
    });

    const buffer = Buffer.from(imgStr.split(",")[1], "base64");
    const resp = await client.labelDetection(buffer);

    const check = resp[0].labelAnnotations.find((val) => {
      return val.description.toLowerCase() == itemName.toLowerCase();
    });

    const score = check ? parseInt(Math.floor(check.score * 10)) : 0;

    console.log({
      itemName,
      check,
      score,
    });

    const room = await Room.findOne({ roomName });
    if (!room) return res.json({ error: "Room not found!" });

    let isWinner = false;

    await Promise.all(
      room.users.map((user) => {
        if (user.userToken == userToken) {
          user.score += score;
          user.checkedItems.push(itemName);
          if (user.checkedItems.length >= room.items.length) isWinner = true;
        }
      })
    );

    await room.save();

    return res.json({ room, isWinner });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

app.post("/join", async (req, res) => {
  const { roomName, userToken, userName } = req.body;

  try {
    const room = await Room.findOne({ roomName });
    if (room) {
      const check = room.users.some((user) => user.userToken == userToken);
      if (check) return res.json({ room });
      room.users.push({ userToken, userName });
      await room.save();
      return res.json({ room });
    }

    const items = ["Banana", "Tin"];
    const newRoom = await Room.create({
      roomName,
      users: [{ userToken, userName }],
      items,
    });

    return res.json({ room: newRoom });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
