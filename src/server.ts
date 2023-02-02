import express, { Errback } from "express";
import http from "http";
import cors from "cors";
import * as dotenv from "dotenv";
import connectDatabase from "./config/datatbase";
import app from "./app";

dotenv.config({ path: __dirname + "\\config\\config.env" });

app.use(express.json());
app.use(cors());

connectDatabase();

// initializing a server manually
const httpServer = http.createServer(app);

// handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("shutting down server due to uncaught exception");
  process.exit(1);
});

const server = httpServer.listen(process.env.PORT, () => {
  console.log(
    `Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

// Handle EADDRINUSE error
server.on("error", (e: any) => {
  if (e.code === "EADDRINUSE") {
    console.log("Address in use, retrying...");
    setTimeout(() => {
      server.close();
      server.listen(process.env.PORT);
    }, 1000);
  }
});

// handle unhandled promise rejection
process.on("unhandledRejection", (err: any) => {
  console.log(`ERROR: ${err.message}`);
  console.log(`shutting down the server due to unhandled promise rejection.`);
  server.close(() => {
    process.exit(1);
  });
});