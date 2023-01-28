module.exports = {
	post: {
		tags: ["Authentication"],
		description: "Sign up",
		operationId: "signup",
		requestBody: {
			content: {
				"application/json": {
					schema: {
						$ref: "#/components/schemas/UserInput",
					},
				},
			},
		},
		responses: {
			200: {
				description: "User registered successfully",
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								message: {
									type: "string",
									example: "Signup successful",
								},
								user: {
									firstname: "John",
									lastname: "Doe",
									email: "johndoe@mail.com",
								},
							},
						},
					},
				},
			},
			400: {
				description: "Bad request",
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/ErrBadRequest",
						},
					},
				},
			},
			404: {
				description: "Not found",
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/ErrNotFound",
						},
					},
				},
			},
			500: {
				description: "Internal server error",
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/ErrServer",
						},
					},
				},
			},
		},
	},
};
