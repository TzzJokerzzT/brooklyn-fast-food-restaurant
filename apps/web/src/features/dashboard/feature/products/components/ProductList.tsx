"use client";

import BasicButton from "@/src/shared/components/ui/BasicButton";
import BasicSpinner from "@/src/shared/components/ui/BasicSpinner";

import { Modal, toast } from "@heroui/react";
import { CirclePlus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDeleteProduct, useDeleteProducts, useProducts } from "../hooks";
import ProductTable from "./ProductTable";

// ── Product List ─────────────────────────────────────────────
// Tabla con todos los productos, paginación básica y acciones.

export default function ProductList() {
	const { data, isLoading, error } = useProducts({ limit: 50 });
	const deleteSingle = useDeleteProduct();
	const deleteBulk = useDeleteProducts();
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const [deleteTarget, setDeleteTarget] = useState<{
		type: "single" | "bulk";
		id?: number;
		ids?: number[];
		count?: number;
	} | null>(null);

	const handleDeleteSingle = (id: number) => {
		setDeleteTarget({ type: "single", id, count: 1 });
	};

	const handleDeleteBulk = () => {
		if (selectedIds.length === 0) return;
		setDeleteTarget({
			type: "bulk",
			ids: selectedIds,
			count: selectedIds.length,
		});
	};

	const confirmDelete = () => {
		if (!deleteTarget) return;

		if (deleteTarget.type === "single" && deleteTarget.id) {
			deleteSingle.mutate(deleteTarget.id, {
				onSuccess: () => {
					toast.success("Producto eliminado exitosamente");
					setSelectedIds((prev) => prev.filter((i) => i !== deleteTarget.id));
					setDeleteTarget(null);
				},
				onError: (err) => {
					const message =
						err instanceof Error ? err.message : "Error al eliminar";
					toast.danger(message);
					setDeleteTarget(null);
				},
			});
		} else if (deleteTarget.type === "bulk" && deleteTarget.ids) {
			deleteBulk.mutate(deleteTarget.ids, {
				onSuccess: () => {
					toast.success(`${deleteTarget.count} productos eliminados`);
					setSelectedIds([]);
					setDeleteTarget(null);
				},
				onError: (err) => {
					const message =
						err instanceof Error ? err.message : "Error al eliminar";
					toast.danger(message);
					setDeleteTarget(null);
				},
			});
		}
	};

	const isDeleting = deleteSingle.isPending || deleteBulk.isPending;

	if (isLoading) {
		return (
			<div className="glass-panel p-6">
				<div className="flex flex-col items-center justify-center h-64">
					<BasicSpinner>
						<p className="font-label-bold text-on-surface-variant animate-pulse">
							Cargando Productos...
						</p>
					</BasicSpinner>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="glass-panel p-6">
				<div className="flex items-center justify-center h-64">
					<p className="font-label-bold text-red-400">
						Error al cargar productos
					</p>
				</div>
			</div>
		);
	}

	const products = data?.products ?? [];

	return (
		<div className="glass-panel p-6">
			{/* Header */}
			<div className="flex justify-between items-center mb-6 border-b border-white/20 pb-4">
				<h3 className="font-headline-lg-mobile text-headline-lg-mobile uppercase text-on-surface">
					PRODUCTOS
				</h3>
				<div className="flex items-center gap-2">
					{selectedIds.length > 0 && (
						<BasicButton
							onPress={handleDeleteBulk}
							className="bg-red-500 hover:bg-red-600 text-white"
						>
							<Trash2 className="w-4 h-4" />
							ELIMINAR ({selectedIds.length})
						</BasicButton>
					)}
					<Link href="/dashboard/products/create">
						<BasicButton className="btn-primary" isIconOnly>
							<CirclePlus className="w-4 h-4" />
						</BasicButton>
					</Link>
				</div>
			</div>

			{/* Products Table */}
			{products.length === 0 ? (
				<div className="flex flex-col items-center justify-center h-64 gap-4">
					<span className="material-symbols-outlined text-6xl text-on-surface-variant">
						inventory_2
					</span>
					<p className="font-label-bold text-on-surface-variant">
						NO HAY PRODUCTOS
					</p>
					<Link href="/dashboard/products/create">
						<BasicButton className="btn-primary">
							CREAR PRIMER PRODUCTO
						</BasicButton>
					</Link>
				</div>
			) : (
				<div className="overflow-x-auto">
					<ProductTable
						products={products}
						selectedIds={selectedIds}
						onSelectionChange={setSelectedIds}
						onDelete={handleDeleteSingle}
					/>
				</div>
			)}

			{/* Footer */}
			<div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
				<p className="font-label-sm text-on-surface-variant">
					{products.length} producto{products.length !== 1 ? "s" : ""} total
				</p>
			</div>

			{/* Delete Confirmation Modal */}
			<Modal.Backdrop
				isOpen={deleteTarget !== null}
				onOpenChange={(open) => {
					if (!open) setDeleteTarget(null);
				}}
			>
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-[400px]">
						<Modal.CloseTrigger />
						<Modal.Header>
							<Modal.Icon className="bg-red-500/20 text-red-400">
								<Trash2 className="size-5" />
							</Modal.Icon>
							<Modal.Heading>Confirmar eliminación</Modal.Heading>
						</Modal.Header>
						<Modal.Body>
							<p className="text-on-surface-variant">
								{deleteTarget?.type === "single"
									? "¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
									: `¿Estás seguro de que deseas eliminar ${deleteTarget?.count} productos? Esta acción no se puede deshacer.`}
							</p>
						</Modal.Body>
						<Modal.Footer>
							<BasicButton
								variant="secondary"
								onPress={() => setDeleteTarget(null)}
								isDisabled={isDeleting}
							>
								Cancelar
							</BasicButton>
							<BasicButton
								onPress={confirmDelete}
								isDisabled={isDeleting}
								isPending={isDeleting}
								className="bg-red-500 hover:bg-red-600 text-white"
							>
								{isDeleting ? "Eliminando..." : "Eliminar"}
							</BasicButton>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</div>
	);
}
