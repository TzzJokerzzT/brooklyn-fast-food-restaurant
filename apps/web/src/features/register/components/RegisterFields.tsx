import BasicInput from "@/src/shared/components/BasicInput";
import {
	validateEmail,
	validateName,
	validatePassword,
	validatePasswordConfirm,
} from "@/src/shared/utils/validations";

import { type ChangeEvent, useState } from "react";

export default function RegisterFields() {
	const [form, setForm] = useState({
		userName: "",
		lastName: "",
		email: "",
		address: "",
		password: "",
		confirmPassword: "",
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
				labelText="Nombre"
				placeholderText="Ingresa tu nombre"
				name="userName"
				value={form.userName}
				onChange={handleChange}
				errorMessage={validateName(form.userName).message}
				validate={(value: string) => validateName(value).valid}
				minLength={2}
				maxLength={100}
			/>

			<BasicInput
				labelText="Apellido"
				placeholderText="Ingresa tu apellido"
				name="lastName"
				value={form.lastName}
				onChange={handleChange}
				errorMessage={validateName(form.lastName).message}
				validate={(value: string) => validateName(value).valid}
				minLength={2}
				maxLength={100}
			/>

			<BasicInput
				labelText="Dirección"
				placeholderText="Ingresa tu dirección"
				name="address"
				value={form.address}
				onChange={handleChange}
				errorMessage="La dirección es requerida"
				validate={(value: string) => value.length >= 2}
				minLength={2}
				maxLength={200}
			/>

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
				errorMessage={validatePassword(form.password).message}
				validate={(value: string) => validatePassword(value).valid}
				minLength={6}
				maxLength={100}
			/>

			<BasicInput
				labelText="Confirmar contraseña"
				placeholderText="Confirma tu contraseña"
				name="confirmPassword"
				type="password"
				value={form.confirmPassword}
				onChange={handleChange}
				errorMessage={
					validatePasswordConfirm(form.password, form.confirmPassword).message
				}
				validate={(value: string) =>
					validatePasswordConfirm(form.password, value).valid
				}
				minLength={6}
				maxLength={100}
			/>
		</div>
	);
}
