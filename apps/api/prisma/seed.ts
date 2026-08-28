import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	// Create default roles
	const _roles = await Promise.all([
		prisma.role.upsert({
			where: { id: 1 },
			update: {},
			create: { id: 1, name: "super-admin" },
		}),
		prisma.role.upsert({
			where: { id: 2 },
			update: {},
			create: { id: 2, name: "admin" },
		}),
		prisma.role.upsert({
			where: { id: 3 },
			update: {},
			create: { id: 3, name: "clients" },
		}),
	]);

	// Create sample products
	const _products = await Promise.all([
		prisma.product.create({
			data: {
				productName: "Classic Burger",
				price: 12.99,
				isPromotion: false,
				ingredients: JSON.stringify([
					"beef patty",
					"lettuce",
					"tomato",
					"onion",
					"special sauce",
				]),
			},
		}),
		prisma.product.create({
			data: {
				productName: "Margherita Pizza",
				price: 14.99,
				isPromotion: true,
				ingredients: JSON.stringify([
					"mozzarella",
					"tomato sauce",
					"fresh basil",
				]),
			},
		}),
		prisma.product.create({
			data: {
				productName: "Caesar Salad",
				price: 9.99,
				isPromotion: false,
				ingredients: JSON.stringify([
					"romaine lettuce",
					"parmesan",
					"croutons",
					"caesar dressing",
				]),
			},
		}),
	]);

	// Create sample events
	const _events = await Promise.all([
		prisma.event.create({
			data: {
				eventName: "Live Jazz Night",
				description: "Enjoy smooth jazz with your dinner",
				eventDateFrom: new Date("2024-03-15T19:00:00Z"),
				eventDateTo: new Date("2024-03-15T23:00:00Z"),
			},
		}),
		prisma.event.create({
			data: {
				eventName: "Wine Tasting Evening",
				description: "Exclusive wine pairing dinner",
				eventDateFrom: new Date("2024-03-22T18:00:00Z"),
				eventDateTo: new Date("2024-03-22T21:00:00Z"),
			},
		}),
	]);
}

main()
	.catch((_e) => {
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
