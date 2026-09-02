import { FieldError, Input, Label, TextField } from "@heroui/react";
import type { BasicInputProps } from "../types/BasicInput";

export default function BasicInput({
	labelText,
	placeholderText,
	name,
	type,
	isRequired = true,
	minLength = 3,
	maxLength,
	errorMessage = "There is a problem with this field",
	value,
	validate,
	className,
	onChange,
	disabled = false,
	variant = "primary",
	pattern,
}: BasicInputProps) {
	return (
		<TextField
			className={className}
			isRequired={isRequired}
			name={name}
			type={type}
			value={value}
			validate={(val) => {
				if (validate && !validate(val)) {
					return errorMessage;
				}
				return null;
			}}
		>
			<Label>{labelText}</Label>
			<Input
				disabled={disabled}
				onChange={onChange}
				placeholder={placeholderText}
				minLength={minLength}
				maxLength={maxLength}
				variant={variant}
				pattern={pattern}
			/>
			<FieldError />
		</TextField>
	);
}
