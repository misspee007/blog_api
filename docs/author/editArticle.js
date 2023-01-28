module.exports = {
	patch: {
    security: [
			{
				bearerAuth: [],
			},
		],
		tags: ["Author CRUD Operations"],
		description: "Edit an article",
		operationId: "editArticle",
		parameters: [
			{
				name: "id",
				in: "path",
				description: "Article ID",
				required: true,
				type: "string",
			},
		],
		requestBody: {
			content: {
				"application/json": {
					schema: {
						$ref: "#/components/schemas/BlogInput",
					},
				},
			},
		},
		responses: {
			200: {
				description: "Article updated successfully",
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								message: {
									type: "string",
									example: "Article successfully edited and saved",
								},
								article: {
									$ref: "#/components/schemas/Blog",
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
