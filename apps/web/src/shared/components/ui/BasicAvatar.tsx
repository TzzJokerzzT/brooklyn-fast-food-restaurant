import { Avatar } from "@heroui/react";
import type { BasicAvatarProps } from "../../types/BasicAvatar";

export default function BasicAvatar({
	children,
	size = "md",
	className,
	variant = "soft",
	isImage = false,
	src,
	alt,
}: BasicAvatarProps) {
	return (
		<Avatar variant={variant} size={size} className={className}>
			{isImage ? (
				<Avatar.Image alt={alt} src={src} />
			) : (
				<Avatar.Fallback>{children}</Avatar.Fallback>
			)}
		</Avatar>
	);
}
