import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
  // Add any other environment variables you need here
}

// If env(s) undefined, it'll throw an error
const loadEnvVars = (): EnvConfig => {
  const requiredEnvVars: string[] = [
    "PORT", 
    "DB_URL", 
    "NODE_ENV",
    // Add any other required environment variables here
];
  requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require environment variables: ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    // Add any other environment variables here
  };
};

const envVars: EnvConfig = loadEnvVars();

export default envVars;