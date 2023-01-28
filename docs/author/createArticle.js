module.exports = {
	post: {
		security: [
			{
				bearerAuth: [],
			},
		],
		tags: ["Author CRUD Operations"],
		description: "Create a new article",
		operationId: "createArticle",
		requestBody: {
			content: {
				"multipart/form-data": {
					schema: {
						$ref: "#/components/schemas/BlogInput",
					},
				},
			},
		},
		responses: {
			201: {
				description: "Article created successfully",
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								message: {
									type: "string",
									example: "Article created successfully",
								},
								articles: {
									type: "array",
									items: {
										$ref: "#/components/schemas/Blog",
									},
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
