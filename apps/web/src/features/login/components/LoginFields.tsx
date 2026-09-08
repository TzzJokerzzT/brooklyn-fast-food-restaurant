import BasicInput from "@/src/shared/components/BasicInput";
import { validateEmail } from "@/src/shared/utils/validations";

import { type ChangeEvent, useState } from "react";

export default function LoginFields() {
	const [form, setForm] = useState({
		email: "",
		password: "",
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<div className="flex flex-col gap-4">
			<BasicInput
				labelText="Email"
				placeholderText="Ingresa tu email"
				name="email"
				type="email"
				value={form.email}
				onChange={handleChange}
				errorMessage={validateEmail(form.email).message}
				validate={(value: string) => validateEmail(value).valid}
				minLength={5}
				maxLength={100}
			/>

			<BasicInput
				labelText="Contraseña"
				placeholderText="Ingresa tu contraseña"
				name="password"
				type="password"
				value={form.password}
				onChange={handleChange}
				errorMessage="La contraseña es requerida"
				validate={(value: string) => value.length >= 6}
				minLength={6}
				maxLength={100}
			/>
		</div>
	);
}
