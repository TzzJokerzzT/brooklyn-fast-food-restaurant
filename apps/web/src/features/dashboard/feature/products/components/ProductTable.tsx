"use client";

import BasicAvatar from "@/src/shared/components/ui/BasicAvatar";
import BasicButton from "@/src/shared/components/ui/BasicButton";
import BasicCheckbox from "@/src/shared/components/ui/BasicCheckbox";
import BasicChip from "@/src/shared/components/ui/BasicChip";

import { EmptyState, Link, type Selection, Table } from "@heroui/react";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { tableHeaders } from "../../../shared/utils/constant";
import type { ProductResponse } from "../services/product.service";

interface ProductTableProps {
	products: ProductResponse[];
	selectedIds: number[];
	onSelectionChange: (ids: number[]) => void;
	onDelete: (id: number) => void;
}

export default function ProductTable({
	products,
	selectedIds,
	onSelectionChange,
	onDelete,
}: ProductTableProps) {
	const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
	const [isCheck, setIsCheck] = useState(false);
	const allSelected =
		selectedIds.length === products.length && products.length > 0;

	const toggleSelectAll = () => {
		if (allSelected) {
			onSelectionChange([]);
		} else {
			onSelectionChange(products.map((p) => p.id));
		}
	};

	const toggleSelect = (id: number) => {
		if (selectedIds.includes(id)) {
			onSelectionChange(selectedIds.filter((i) => i !== id));
		} else {
			onSelectionChange([...selectedIds, id]);
		}
	};

	return (
		<Table>
			<Table.ScrollContainer>
				<Table.Content
					aria-label="Lista de productos"
					className="min-w-[700px]"
					selectedKeys={selectedKeys}
					selectionMode="multiple"
					onSelectionChange={setSelectedKeys}
				>
					<Table.Header>
						<Table.Column className="w-12">
							<BasicCheckbox
								slot="selection"
								isSelected={isCheck}
								onChange={() => {
									setIsCheck(!isCheck);
									toggleSelectAll();
								}}
								controlClassName="border-1 border-mustard/50 rounded-xl before:bg-mustard"
								indicatorClassName="**:data-[slot=checkbox-default-indicator--checkmark]:text-success-foreground"
							/>
						</Table.Column>
						{tableHeaders.map((items) => (
							<Table.Column key={items.key} className="text-center">
								{items.label}
							</Table.Column>
						))}
					</Table.Header>
					<Table.Body
						renderEmptyState={() => (
							<EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
								<span className="material-symbols-outlined text-6xl text-muted">
									inventory_2
								</span>
								<span className="text-sm text-muted">No results found</span>
							</EmptyState>
						)}
					>
						{products.map((item) => (
							<Table.Row key={item.id}>
								<Table.Cell>
									<BasicCheckbox
										isSelected={selectedIds.includes(item.id)}
										onChange={() => toggleSelect(item.id)}
										controlClassName="border-1 border-mustard/50 rounded-xl before:bg-mustard"
										indicatorClassName="**:data-[slot=checkbox-default-indicator--checkmark]:text-success-foreground"
									/>
								</Table.Cell>
								<Table.Cell>
									<div className="flex gap-3 items-center">
										<BasicAvatar
											className="rounded-[50%]"
											isImage
											src={item.productImage || ""}
											alt={`${item.productName} foto`}
										/>
										{item.productName}
									</div>
								</Table.Cell>
								<Table.Cell>{item?.price?.toLocaleString()}</Table.Cell>
								<Table.Cell>
									<div className="flex flex-wrap gap-1">
										{item.ingredients.slice(0, 3).map((ing) => (
											<BasicChip
												size="lg"
												key={ing}
												className="px-2 py-1 bg-white/10 text-on-surface-variant text-xs font-label-sm"
											>
												{ing}
											</BasicChip>
										))}
										{item.ingredients.length > 3 && (
											<BasicChip
												size="lg"
												className="px-2 py-1 bg-white/10 text-on-surface-variant text-xs font-label-sm"
											>
												+{item.ingredients.length - 3}
											</BasicChip>
										)}
									</div>
								</Table.Cell>
								<Table.Cell>
									<BasicChip
										size="lg"
										className={`px-2 py-1 ${item.isPromotion ? "bg-mustard/20 text-mustard text-xs font-label-bold uppercase" : "bg-white/10 text-on-surface-variant text-xs font-label-bold uppercase"}`}
									>
										{item.isPromotion ? "En Promo" : "No"}
									</BasicChip>
								</Table.Cell>
								<Table.Cell>
									<div className="flex items-center justify-center gap-2">
										<Link href={`/dashboard/products/edit?id=${item.id}`}>
											<BasicButton
												isIconOnly
												className="bg-mustard/20 hover:bg-mustard/10 text-on-surface"
											>
												<Edit2 size={16} />
											</BasicButton>
										</Link>
										<BasicButton
											isIconOnly
											className="bg-red-500/20 hover:bg-red-500/30 text-red-400"
											onPress={() => onDelete(item.id)}
										>
											<Trash2 size={16} />
										</BasicButton>
									</div>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Content>
			</Table.ScrollContainer>
		</Table>
	);
}
