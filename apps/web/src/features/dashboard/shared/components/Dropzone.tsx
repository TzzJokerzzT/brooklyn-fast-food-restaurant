"use client";

import { UploadCloud, X } from "lucide-react";
import Image from "next/image";
import {
	type ChangeEvent,
	type DragEvent,
	useId,
	useRef,
	useState,
} from "react";

interface DropzoneProps {
	/** Archivo seleccionado localmente (no subido aún). */
	file: File | null;
	/** URL de imagen existente del servidor (para preview en modo edición). */
	existingImageUrl?: string | null;
	/** Se llama con el archivo seleccionado, o null al quitarlo. */
	onChange: (file: File | null) => void;
	label?: string;
	helperText?: string;
	/** Mensaje de error de validación. */
	error?: string;
	/** Tipos MIME aceptados. Default: imágenes comunes. */
	accept?: string;
	maxSizeMB?: number;
	disabled?: boolean;
}

export function Dropzone({
	file: _file,
	existingImageUrl,
	onChange,
	label,
	helperText,
	error,
	accept = "image/png,image/jpeg,image/webp",
	maxSizeMB = 5,
	disabled,
}: DropzoneProps) {
	const inputId = useId();
	const inputRef = useRef<HTMLInputElement>(null);

	const [isDragging, setIsDragging] = useState(false);
	const [localError, setLocalError] = useState<string | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const displayUrl = previewUrl || existingImageUrl || null;
	const errorMessage = error ?? localError;
	const acceptedTypes = accept.split(",").map((type) => type.trim());

	const validateFile = (f: File): string | null => {
		const matchesType = acceptedTypes.some((type) =>
			type.endsWith("/*")
				? f.type.startsWith(type.replace("/*", "/"))
				: f.type === type,
		);
		if (!matchesType) {
			return `Formato no permitido. Usa: ${accept.replaceAll(",", ", ")}`;
		}
		if (f.size > maxSizeMB * 1024 * 1024) {
			return `El archivo supera el tamaño máximo de ${maxSizeMB}MB`;
		}
		return null;
	};

	const handleFile = (f: File) => {
		const validationError = validateFile(f);
		if (validationError) {
			setLocalError(validationError);
			return;
		}

		setLocalError(null);
		const objectUrl = URL.createObjectURL(f);
		setPreviewUrl(objectUrl);
		onChange(f);
	};

	const openFileDialog = () => {
		if (!disabled) inputRef.current?.click();
	};

	const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const f = event.target.files?.[0];
		if (f) handleFile(f);
		event.target.value = "";
	};

	const onDrop = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragging(false);
		if (disabled) return;
		const f = event.dataTransfer.files?.[0];
		if (f) handleFile(f);
	};

	const onRemove = (event: React.MouseEvent) => {
		event.stopPropagation();
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		setPreviewUrl(null);
		setLocalError(null);
		onChange(null);
	};

	return (
		<div className="flex flex-col gap-1.5">
			{label && (
				<label
					htmlFor={inputId}
					className="font-label-sm text-label-sm text-secondary uppercase"
				>
					{label}
				</label>
			)}

			{/* biome-ignore lint/a11y/useSemanticElements: button needed for drag-and-drop */}
			<div
				role="button"
				tabIndex={disabled ? -1 : 0}
				onClick={openFileDialog}
				onKeyDown={(event) => {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						openFileDialog();
					}
				}}
				onDragOver={(event) => {
					event.preventDefault();
					if (!disabled) setIsDragging(true);
				}}
				onDragLeave={() => setIsDragging(false)}
				onDrop={onDrop}
				className={[
					"relative flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed p-4 text-center transition-colors",
					isDragging
						? "border-mustard bg-mustard/5"
						: "border-white/20 bg-black",
					errorMessage ? "border-red-500/60" : "",
					disabled ? "cursor-not-allowed opacity-60" : "",
				].join(" ")}
			>
				<input
					ref={inputRef}
					id={inputId}
					type="file"
					accept={accept}
					className="hidden"
					onChange={onInputChange}
					disabled={disabled}
				/>

				{displayUrl ? (
					<div className="relative">
						{/* eslint-disable-next-line @next/next/no-img-element -- preview de blob local, no requiere optimización */}
						<Image
							width={200}
							height={200}
							src={displayUrl}
							alt="Vista previa"
							className="h-24 w-24 rounded-xl object-cover"
						/>

						<button
							type="button"
							onClick={onRemove}
							className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow"
							aria-label="Quitar imagen"
						>
							<X className="h-3.5 w-3.5" />
						</button>
					</div>
				) : (
					<>
						<UploadCloud className="h-7 w-7 text-white/40" />
						<p className="text-sm text-white/70">
							Arrastra una imagen aquí o{" "}
							<span className="font-medium text-mustard">
								haz clic para elegir
							</span>
						</p>
						<p className="text-xs text-white/40">
							{accept.replaceAll(",", ", ")} — máx {maxSizeMB}MB
						</p>
					</>
				)}
			</div>

			{helperText && !errorMessage && (
				<p className="text-xs text-white/50">{helperText}</p>
			)}
			{errorMessage && (
				<p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
					{errorMessage}
				</p>
			)}
		</div>
	);
}
