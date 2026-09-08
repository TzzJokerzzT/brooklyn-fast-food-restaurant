"use client";

import ProductList from "../features/dashboard/feature/products/components/ProductList";
import DashboardLayout from "../features/dashboard/shared/components/DashboardLayout";

// ── Product List Page ────────────────────────────────────────
// Lista todos los productos existentes con opciones de edición.

export default function ProductListPage() {
	return (
		<DashboardLayout>
			<ProductList />
		</DashboardLayout>
	);
}
