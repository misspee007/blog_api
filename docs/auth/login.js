module.exports = {
	post: {
		tags: ["Authentication"],
		description: "Login",
		operationId: "login",
		requestBody: {
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							email: {
								type: "string",
								example: "johndoe@mail.com",
								required: true,
							},
							password: {
								type: "string",
								example: "password",
								required: true,
							},
						},
					},
				},
			},
		},
		responses: {
			200: {
				description: "User logged in successfully",
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								message: {
									type: "string",
									example: "Login successful",
								},
								token: {
									type: "string",
									example: "hjdjpahnear.ajhjdhjajhj.ajhjdhjajhj",
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
