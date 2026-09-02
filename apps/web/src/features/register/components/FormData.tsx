import { useState } from "react";
import BasicInput from "@/src/shared/components/BasicInput";
import {
	validateEmail,
	validateName,
	validatePassword,
	validatePasswordConfirm,
} from "@/src/shared/utils/validations";

export default function FormData() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [name, setName] = useState("");

	return (
		<div className="flex flex-col gap-4">
			<BasicInput
				labelText="Nombre"
				placeholderText="Ingresa tu nombre"
				name="name"
				value={name}
				onChange={(e) => setName(e.target.value)}
				errorMessage={validateName(name).message}
				validate={(value) => validateName(value).valid}
			/>

			<BasicInput
				labelText="Email"
				placeholderText="Ingresa tu email"
				name="email"
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				errorMessage={validateEmail(email).message}
				validate={(value) => validateEmail(value).valid}
			/>

			<BasicInput
				labelText="Contraseña"
				placeholderText="Ingresa tu contraseña"
				name="password"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				errorMessage={validatePassword(password).message}
				validate={(value) => validatePassword(value).valid}
			/>

			<BasicInput
				labelText="Confirmar contraseña"
				placeholderText="Confirma tu contraseña"
				name="confirmPassword"
				type="password"
				value={confirmPassword}
				onChange={(e) => setConfirmPassword(e.target.value)}
				errorMessage={validatePasswordConfirm(password, confirmPassword).message}
				validate={(value) => validatePasswordConfirm(password, value).valid}
			/>
		</div>
	);
}
