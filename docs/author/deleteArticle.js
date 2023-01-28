module.exports = {
	delete: {
		security: [
			{
				bearerAuth: [],
			},
		],
		tags: ["Author CRUD Operations"],
		description: "Delete an article",
		operationId: "deleteArticle",
		parameters: [
			{
				name: "id",
				in: "path",
				description: "Article ID",
				required: true,
				type: "string",
			},
		],
		responses: {
			200: {
				description: "Article deleted successfully",
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								message: {
									type: "string",
									example: "Article successfully deleted",
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
