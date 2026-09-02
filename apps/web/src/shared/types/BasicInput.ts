import type { ChangeEvent } from "react";

export interface BasicInputProps {
	labelText: string;
	placeholderText: string;
	name: string;
	type?: string;
	isRequired?: boolean;
	minLength?: number;
	maxLength?: number;
	errorMessage?: string;
	validate?: (value: string) => boolean;
	value?: string;
	className?: string;
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
	disabled?: boolean;
	variant?: "primary" | "secondary";
	pattern?: string;
}
