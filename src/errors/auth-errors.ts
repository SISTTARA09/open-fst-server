import { SignInError } from "./error.constructors.js";

async function handleCredentialsErrors(error: any) {
	// if duplicated
	if (error.code === 11000) {
		for (let k in error.keyValue) {
			return new SignInError(k, `this ${k} is already used!!`);
		}
		///
	} else {
		return error;
	}
}

export { handleCredentialsErrors };
