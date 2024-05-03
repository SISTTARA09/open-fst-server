class SignInError {
	constructor(
		public type: string,
		public message: string,
		public code?: number
	) {}
}

export { SignInError };
