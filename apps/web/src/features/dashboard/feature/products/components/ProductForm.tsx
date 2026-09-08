"use client";

import BasicButton from "@/src/shared/components/ui/BasicButton";
import BasicChip from "@/src/shared/components/ui/BasicChip";
import BasicInput from "@/src/shared/components/ui/BasicInput";
import BasicSwitch from "@/src/shared/components/ui/BasicSwitch";

import { toast } from "@heroui/react";
import { CirclePlus, Save, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Dropzone } from "../../../shared/components/Dropzone";
import DashboardLayout from "../../dashboard/components/DashboardLayout";
import {
	useCreateProduct,
	useCreateProducts,
	useProduct,
	useUpdateProduct,
} from "../hooks";

// ── Inner form (needs Suspense for useSearchParams) ──────────

function ProductFormInner() {
	const searchParams = useSearchParams();
	const editId = searchParams.get("id");
	const isEditMode = !!editId;

	// Fetch product data ONLY in edit mode
	const numericId = Number(editId);
	const { data: existingProduct, isLoading: isLoadingProduct } = useProduct(
		isEditMode ? numericId : 0,
	);

	// Form state
	const [mode, setMode] = useState<"single" | "bulk">("single");
	const [items, setItems] = useState<
		Array<{
			productName: string;
			price: number;
			isPromotion: boolean;
			ingredients: string[];
			productImage: File | null;
			existingImageUrl: string | null;
		}>
	>([
		{
			productName: "",
			price: 0,
			isPromotion: false,
			ingredients: [],
			productImage: null,
			existingImageUrl: null,
		},
	]);
	const [error, setError] = useState<string | null>(null);
	const [ingredientInput, setIngredientInput] = useState("");
	// Mutations
	const createSingle = useCreateProduct();
	const createBulk = useCreateProducts();
	const updateMutation = useUpdateProduct();

	const isSubmitting =
		createSingle.isPending || createBulk.isPending || updateMutation.isPending;

	// Populate form when editing
	useEffect(() => {
		if (isEditMode && existingProduct) {
			setItems([
				{
					productName: existingProduct.productName,
					price: existingProduct.price,
					isPromotion: existingProduct.isPromotion,
					ingredients: [...existingProduct.ingredients],
					productImage: null,
					existingImageUrl: existingProduct.productImage ?? null,
				},
			]);
		}
	}, [isEditMode, existingProduct]);

	// ── Handlers ──────────────────────────────────────────────

	const updateItem = (index: number, data: Partial<(typeof items)[0]>) => {
		setItems((prev) =>
			prev.map((item, i) => (i === index ? { ...item, ...data } : item)),
		);
	};

	const addItem = () => {
		setItems((prev) => [
			...prev,
			{
				productName: "",
				price: 0,
				isPromotion: false,
				ingredients: [],
				productImage: null,
				existingImageUrl: null,
			},
		]);
	};

	const removeItem = (index: number) => {
		setItems((prev) => prev.filter((_, i) => i !== index));
	};

	const resetForm = () => {
		if (isEditMode && existingProduct) {
			setItems([
				{
					productName: existingProduct.productName,
					price: existingProduct.price,
					isPromotion: existingProduct.isPromotion,
					ingredients: [...existingProduct.ingredients],
					productImage: null,
					existingImageUrl: existingProduct.productImage ?? null,
				},
			]);
		} else {
			setItems([
				{
					productName: "",
					price: 0,
					isPromotion: false,
					ingredients: [],
					productImage: null,
					existingImageUrl: null,
				},
			]);
		}
		setError(null);
	};

	const addIngredient = (itemIndex: number) => {
		const trimmed = ingredientInput.trim();
		if (trimmed && !items[itemIndex].ingredients.includes(trimmed)) {
			updateItem(itemIndex, {
				ingredients: [...items[itemIndex].ingredients, trimmed],
			});
			setIngredientInput("");
		}
	};

	const removeIngredient = (itemIndex: number, ingredient: string) => {
		updateItem(itemIndex, {
			ingredients: items[itemIndex].ingredients.filter((i) => i !== ingredient),
		});
	};

	// ── Submit ────────────────────────────────────────────────

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		// Validation
		const invalid = items.find(
			(item) => !item.productName.trim() || item.price <= 0,
		);
		if (invalid) {
			setError("Todos los productos deben tener nombre y precio válido");
			return;
		}

		if (!isEditMode && mode === "single" && !items[0]?.productImage) {
			setError("La imagen del producto es requerida");
			return;
		}

		// ── Edit mode ──────────────────────────────────────────
		if (isEditMode && editId) {
			const item = items[0];
			updateMutation.mutate(
				{
					id: Number(editId),
					dto: {
						productName: item.productName.trim(),
						price: item.price,
						isPromotion: item.isPromotion,
						ingredients: item.ingredients,
					},
					imageFile: item.productImage ?? undefined,
				},
				{
					onSuccess: () => {
						toast.success("Producto actualizado exitosamente");
					},
					onError: (err) => {
						const message =
							err instanceof Error ? err.message : "Error al actualizar";
						toast.danger(message);
					},
				},
			);
			return;
		}

		// ── Create single ──────────────────────────────────────
		if (mode === "single") {
			const item = items[0];
			if (!item.productImage) {
				setError("La imagen del producto es requerida");
				return;
			}
			createSingle.mutate({
				dto: {
					productName: item.productName.trim(),
					isPromotion: item.isPromotion,
					price: item.price,
					ingredients: item.ingredients,
				},
				imageFile: item.productImage,
			});
			return;
		}

		// ── Create bulk ────────────────────────────────────────
		const formData = new FormData();
		const productsPayload = items.map((item) => ({
			productName: item.productName.trim(),
			isPromotion: item.isPromotion,
			price: item.price,
			ingredients: item.ingredients,
		}));

		formData.append("products", JSON.stringify(productsPayload));

		items.forEach((item, index) => {
			if (item.productImage) {
				formData.append(
					"productImages",
					item.productImage,
					`${index}_${item.productImage.name}`,
				);
			}
		});

		createBulk.mutate(formData, {
			onSuccess: (data) => {
				toast.success(`${data.count} productos creados exitosamente`);
				resetForm();
			},
			onError: (err) => {
				const message =
					err instanceof Error ? err.message : "Error al crear productos";
				setError(message);
				toast.danger(message);
			},
		});
	};

	// ── Loading state ─────────────────────────────────────────

	if (isEditMode && isLoadingProduct) {
		return (
			<DashboardLayout>
				<div className="glass-panel p-6">
					<div className="flex items-center justify-center h-64">
						<p className="font-label-bold text-on-surface-variant animate-pulse">
							CARGANDO PRODUCTO...
						</p>
					</div>
				</div>
			</DashboardLayout>
		);
	}

	// ── Render ────────────────────────────────────────────────

	return (
		<DashboardLayout>
			<div className="glass-panel p-6">
				{/* Header */}
				<div className="flex justify-between items-center mb-6 border-b border-white/20 pb-4">
					<h3 className="font-headline-lg-mobile text-headline-lg-mobile uppercase text-on-surface">
						{isEditMode ? "EDITAR PRODUCTO" : "CREAR PRODUCTO"}
					</h3>
					{!isEditMode && (
						<div className="flex items-center gap-2">
							<BasicButton
								type="button"
								onPress={() => setMode("single")}
								className={`rounded-2xl font-label-bold uppercase transition-colors ${
									mode === "single"
										? "bg-mustard text-black"
										: "bg-white/10 text-white hover:bg-white/20"
								}`}
							>
								SINGLE
							</BasicButton>
							<BasicButton
								type="button"
								onPress={() => setMode("bulk")}
								className={`font-label-bold uppercase transition-colors ${
									mode === "bulk"
										? "bg-mustard text-black"
										: "bg-white/10 text-white hover:bg-white/20"
								}`}
							>
								BULK
							</BasicButton>
						</div>
					)}
				</div>

				{error && (
					<div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-label-sm">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Product Items */}
					<div className="space-y-8">
						{items.map((item, index) => (
							<div key={`product-${mode}-${index}`}>
								{/* Bulk item header */}
								{!isEditMode && mode === "bulk" && (
									<div className="flex justify-between items-center mb-4">
										<span className="font-label-bold text-label-bold text-mustard text-xs">
											PRODUCT #{String(index + 1).padStart(2, "0")}
										</span>
										{items.length > 1 && (
											<button
												type="button"
												onClick={() => removeItem(index)}
												className="text-red-400 hover:text-red-300 text-xs font-label-bold"
											>
												REMOVE
											</button>
										)}
									</div>
								)}

								<div
									className={`p-4 bg-black border ${
										!isEditMode && mode === "bulk"
											? "border-white/10"
											: "border-white/20"
									}`}
								>
									{/* Image */}
									<Dropzone
										label="Imagen del producto"
										file={item.productImage}
										existingImageUrl={item.existingImageUrl}
										onChange={(file: File | null) =>
											updateItem(index, {
												productImage: file,
												existingImageUrl: null,
											})
										}
										helperText={
											isEditMode
												? "Dejar vacío para mantener la imagen actual"
												: "Arrastra o haz clic para seleccionar"
										}
									/>

									{/* Name */}
									<div className="mt-4">
										<BasicInput
											labelText="Nombre del producto"
											placeholderText="e.g. THE BROOKLYN BRUISER"
											type="text"
											name="productName"
											value={item.productName}
											onChange={(e) =>
												updateItem(index, { productName: e.target.value })
											}
										/>
									</div>

									{/* Price */}
									<div className="mt-4">
										<BasicInput
											labelText="Precio (USD)"
											placeholderText="0.00"
											type="text"
											name="price"
											value={String(item.price || "")}
											onChange={(e) =>
												updateItem(index, {
													price: Number.parseFloat(e.target.value) || 0,
												})
											}
										/>
									</div>

									{/* Promotion */}
									<div className="flex items-center justify-between py-3 border-b border-white/20 mt-4">
										<BasicSwitch
											className={`rounded-xl transition-colors ${
												item.isPromotion ? "bg-mustard" : "bg-white/20"
											}`}
											onPress={() =>
												updateItem(index, { isPromotion: !item.isPromotion })
											}
											isSelected={item.isPromotion}
										>
											En Promoción
										</BasicSwitch>
									</div>

									{/* Ingredients */}
									<div className="mt-4">
										<div className="flex gap-2 mb-3">
											<div className="flex-1">
												<BasicInput
													labelText="Ingredientes"
													placeholderText="Escribe y presiona Enter"
													type="text"
													name="ingredients"
													value={ingredientInput}
													onChange={(e) => setIngredientInput(e.target.value)}
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															e.preventDefault();
															addIngredient(index);
														}
													}}
													isRequired={false}
												/>
											</div>
											<BasicButton
												type="button"
												onPress={() => addIngredient(index)}
												className="mt-6"
												isIconOnly
											>
												<CirclePlus size={16} />
											</BasicButton>
										</div>

										{item.ingredients.length > 0 && (
											<div className="flex flex-wrap gap-2">
												{item.ingredients.map((ingredient) => (
													<BasicChip
														key={ingredient}
														className="bg-mustard/20 border border-mustard/40 text-mustard text-xs font-label-bold cursor-pointer hover:bg-mustard/60 transition-colors"
														onClick={() => removeIngredient(index, ingredient)}
														icon={<X size={12} />}
													>
														{ingredient}
													</BasicChip>
												))}
											</div>
										)}
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Add item button (bulk mode only, create) */}
					{!isEditMode && mode === "bulk" && (
						<BasicButton
							type="button"
							onPress={addItem}
							isDisabled={isSubmitting}
							className="w-full py-3 border border-dashed bg-transparent border-white/20 text-white/60 hover:border-mustard hover:text-mustard transition-colors font-label-bold text-label-bold text-sm uppercase disabled:opacity-50"
						>
							+ ADD ANOTHER PRODUCT
						</BasicButton>
					)}

					{/* Actions */}
					<div className="flex gap-4 pt-4 border-t border-white/20">
						<BasicButton
							type="button"
							onPress={resetForm}
							isDisabled={isSubmitting}
							className="btn-secondary flex-1"
						>
							{isEditMode ? "Restaurar" : "Iniciar de nuevo"}
						</BasicButton>
						<BasicButton
							type="submit"
							isDisabled={isSubmitting}
							className="btn-primary flex-1 flex justify-center items-center gap-2"
							isPending={isSubmitting}
						>
							{isSubmitting ? (
								isEditMode ? (
									"Guardando..."
								) : (
									"Creando..."
								)
							) : isEditMode ? (
								<div className="flex items-center gap-2">
									<Save className="w-5 h-5" />
									Guardar Cambios
								</div>
							) : (
								<div className="flex items-center gap-2">
									<CirclePlus className="w-5 h-5" />
									{mode === "single"
										? "Crear producto"
										: `Crear ${items.length} productos`}
								</div>
							)}
						</BasicButton>
					</div>
				</form>
			</div>
		</DashboardLayout>
	);
}

// ── Product Form ──────────────────────────────────────────────
// Formulario unificado para crear y editar productos.
// Detecta el modo via search params: ?id=X → edit, sin id → create.

export default function ProductForm() {
	return (
		<Suspense
			fallback={
				<DashboardLayout>
					<div className="glass-panel p-6">
						<div className="flex items-center justify-center h-64">
							<p className="font-label-bold text-on-surface-variant animate-pulse">
								CARGANDO...
							</p>
						</div>
					</div>
				</DashboardLayout>
			}
		>
			<ProductFormInner />
		</Suspense>
	);
}
