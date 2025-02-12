import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactsRoutes.js";
import setupSocket from "./socket.js";

const app = express();
const port = process.env.PORT || 3000;
const databaseURL = process.env.DATABASE_URL;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/contacts",contactsRoutes)
mongoose
  .connect(databaseURL)
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    console.log("DB unable to connect", error);
  });

const server = app.listen(port, () => {
  console.log("sever is running at port", port);
});

setupSocket(server);