import ProductListPage from "@/src/views/ProductListPage";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Productos | Brooklyn Management",
	description: "Lista de productos del restaurante",
};

export default function ProductsPage() {
	return <ProductListPage />;
}
