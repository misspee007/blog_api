module.exports = {
	get: {
		security: [
			{
				bearerAuth: [],
			},
		],
		tags: ["Author CRUD Operations"],
		description: "Get all articles created by the user",
		operationId: "getUsersArticles",
		parameters: [
			{
				name: "order_by",
				in: "query",
				description: "Order by attribute",
				required: false,
				type: "string",
				default: "timestamp",
			},
			{
				name: "order",
				in: "query",
				description: "Order by asc or desc",
				required: false,
				type: "string",
				enum: ["asc", "desc"],
				default: "asc",
			},
			{
				name: "page",
				in: "query",
				description: "Page number",
				required: false,
				type: "integer",
				default: 1,
			},
			{
				name: "per_page",
				in: "query",
				description: "Number of articles per page",
				required: false,
				type: "integer",
				default: 20,
			},
			{
				name: "state",
				in: "query",
				description: "Article state: draft or published",
				required: false,
				type: "string",
				enum: ["draft", "published"],
			},
		],
		responses: {
			200: {
				description: "Request successful",
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								message: {
									type: "string",
									example: "Request successful",
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
