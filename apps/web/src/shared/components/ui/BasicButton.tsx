import { Button, Spinner } from "@heroui/react";
import type { BasicButtonProps } from "../../types/BasicButton";

export default function BasicButton({
	children,
	variant = "primary",
	isDisabled = false,
	isPending = false,
	isIconOnly = false,
	onPress,
	type = "button",
	className = "",
}: BasicButtonProps) {
	return (
		<Button
			variant={variant}
			isDisabled={isDisabled}
			isPending={isPending}
			isIconOnly={isIconOnly}
			onPress={onPress}
			type={type}
			className={className}
		>
			{isPending ? <Spinner color="current" size="sm" /> : null}
			{children}
		</Button>
	);
}
