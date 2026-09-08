import type { ProductFormData } from "../store/product-store";

export interface ProductItemProps {
	item: ProductFormData;
	index: number;
	mode: "single" | "bulk";
	canRemove: boolean;
	onUpdate: (data: Partial<ProductFormData>) => void;
	onRemove: () => void;
}
