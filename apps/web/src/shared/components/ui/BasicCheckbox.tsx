import { Checkbox } from "@heroui/react";
import type { ReactNode } from "react";

export interface BasicCheckboxProps {
	name?: string;
	isDisabled?: boolean;
	isSelected?: boolean;
	onChange?: (selected: boolean) => void;
	controlClassName?: string;
	indicatorClassName?: string;
	children?: ReactNode;
	slot?: string;
}

export default function BasicCheckbox({
	name,
	isDisabled,
	isSelected,
	onChange,
	controlClassName,
	indicatorClassName,
	children,
	slot,
}: BasicCheckboxProps) {
	return (
		<Checkbox
			name={name}
			isDisabled={isDisabled}
			isSelected={isSelected}
			onChange={onChange}
			slot={slot}
		>
			<Checkbox.Content>
				<Checkbox.Control className={controlClassName}>
					<Checkbox.Indicator className={indicatorClassName} />
				</Checkbox.Control>
				{children}
			</Checkbox.Content>
		</Checkbox>
	);
}
