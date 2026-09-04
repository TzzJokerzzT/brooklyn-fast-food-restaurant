import { env } from "@/lib/env.js";

import { v2 as cloudinary } from "cloudinary";

// ── Cloudinary Service ───────────────────────────────────────
// Handles image uploads to Cloudinary

cloudinary.config({
	cloud_name: env.CLOUDINARY_CLOUD_NAME,
	api_key: env.CLOUDINARY_API_KEY,
	api_secret: env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
	url: string;
	public_id: string;
}

export class CloudinaryService {
	// biome-ignore lint/suspicious/useAwait: Wrapping callback-based API in async for interface compatibility
	async uploadImage(
		file: Express.Multer.File,
		folder = "brooklyn-restaurant",
	): Promise<CloudinaryUploadResult> {
		return new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					folder,
					resource_type: "image",
					transformation: [
						{ width: 800, height: 800, crop: "limit" },
						{ quality: "auto" },
					],
				},
				(error, result) => {
					if (error) {
						reject(new Error(`Cloudinary upload failed: ${error.message}`));
						return;
					}
					if (!result) {
						reject(new Error("Cloudinary upload failed: no result"));
						return;
					}
					resolve({
						url: result.secure_url,
						public_id: result.public_id,
					});
				},
			);

			uploadStream.end(file.buffer);
		});
	}

	async deleteImage(publicId: string): Promise<void> {
		await cloudinary.uploader.destroy(publicId);
	}

	getPublicIdFromUrl(url: string): string | null {
		const match = url.match(/\/v\d+\/(.+)\.\w+$/);
		return match ? match[1] : null;
	}
}

export const cloudinaryService = new CloudinaryService();
