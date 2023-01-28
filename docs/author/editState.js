module.exports = {
	patch: {
    security: [
			{
				bearerAuth: [],
			},
		],
		tags: ["Author CRUD Operations"],
		description: "Edit article state",
		operationId: "editState",
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
						type: "object",
            properties: {
              state: {
                type: "string",
                enum: ["draft", "published"],
                example: "published",
              },
            },
					},
				},
			},
		},
		responses: {
			200: {
				description: "State updated successfully",
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								message: {
									type: "string",
									example: "State successfully updated",
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
