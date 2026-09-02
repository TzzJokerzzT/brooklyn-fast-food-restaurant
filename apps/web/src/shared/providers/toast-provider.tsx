import { Toast, ToastQueue } from "@heroui/react";
import { CustomToast } from "../components/Toast";

export const toastQueue = new ToastQueue({ maxVisibleToasts: 4 });

export default function ToastProvider() {
	return (
		<Toast.Provider placement="bottom" queue={toastQueue}>
			{({ toast }) => <CustomToast toast={toast} />}
		</Toast.Provider>
	);
}
