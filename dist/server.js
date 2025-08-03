"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = __importDefault(require("./app/config/env"));
const seedSuperAdmin_1 = __importDefault(require("./app/utils/seedSuperAdmin"));
let server;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to MongoDB
        yield mongoose_1.default.connect(env_1.default.DB_URL);
        console.log("Connected to MongoDB");
        // Start the server
        server = app_1.default.listen(env_1.default.PORT, () => {
            console.log(`Server is running on http://localhost:${env_1.default.PORT}`);
        });
    }
    catch (error) {
        console.error("Error starting the server:", error);
    }
});
// IFFY: (async()=>{})()
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield startServer(); // FIRST: Start server
    yield (0, seedSuperAdmin_1.default)(); // SECOND: Seed super admin
}))();
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
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received. Server shutting down...");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("SIGINT", () => {
    console.log("SIGINT signal received. Server shutting down...");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
