import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
import envVars from "./config/env";

let server: Server;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(envVars.DB_URL);
    console.log("Connected to MongoDB");

    // Start the server
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();

process.on("unhandledRejection", (error) => {
  console.log("unhandled rejection error detected... Server shutting down", error);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.log("uncaught exception error detected... Server shutting down", error);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGTERM", ()=>{
    console.log("SIGTERM signal received. Server shutting down...");

    if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
})

process.on("SIGINT", ()=>{
    console.log("SIGINT signal received. Server shutting down...");

    if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
})