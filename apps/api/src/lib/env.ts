import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
	PORT: z.coerce.number().default(3001),
	DATABASE_URL: z.string().url(),
	CORS_ORIGIN: z.string().default("http://localhost:3000"),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	JWT_ACCESS_SECRET: z.string().min(32),
	JWT_REFRESH_SECRET: z.string().min(32),
	JWT_ACCESS_EXPIRATION: z.string().default("15m"),
	JWT_REFRESH_EXPIRATION: z.string().default("7d"),
	CLOUDINARY_CLOUD_NAME: z.string().min(1),
	CLOUDINARY_API_KEY: z.string().min(1),
	CLOUDINARY_API_SECRET: z.string().min(1),
});

export const env = envSchema.parse(process.env);
