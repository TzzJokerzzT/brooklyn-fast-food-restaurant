import { type PressEvent, Switch } from "@heroui/react";
import type { ReactNode } from "react";

export interface BasicSwitchProps {
	className?: string;
	onPress?: (e: PressEvent) => void;
	isRequired?: boolean;
	isSelected?: boolean;
	children?: ReactNode;
}

export default function BasicSwitch({
	className,
	isRequired = false,
	onPress,
	isSelected = false,
	children,
}: BasicSwitchProps) {
	return (
		<Switch
			id="autosave"
			onPress={(e) => {
				onPress?.(e);
			}}
			isRequired={isRequired}
			isSelected={isSelected}
		>
			<Switch.Content>
				{children}
				<Switch.Control className={className}>
					<Switch.Thumb />
				</Switch.Control>
			</Switch.Content>
		</Switch>
	);
}
