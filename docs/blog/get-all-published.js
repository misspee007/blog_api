module.exports = {
	get: {
		tags: ["Blog Read Operations"],
		description: "Get all published articles",
		operationId: "getBlog",
		parameters: [
			{
				name: "author",
				in: "query",
				description: "Author ID",
				required: false,
				type: "string",
			},
			{
				name: "title",
				in: "query",
				description: "Article title",
				required: false,
				type: "string",
			},
			{
				name: "tags",
				in: "query",
				description: "Article tags",
				required: false,
				type: "string",
			},
			{
				name: "order_by",
				in: "query",
				description: "Order by attribute",
				required: false,
				type: "string",
				enum: ["timestamp", "reading_time", "read_count"],
			},
			{
				name: "order",
				in: "query",
				description: "Order by asc or desc",
				required: false,
				type: "string",
				enum: ["asc", "desc"],
			},
			{
				name: "page",
				in: "query",
				description: "Page number",
				required: false,
				type: "integer",
			},
			{
				name: "per_page",
				in: "query",
				description: "Number of articles per page",
				required: false,
				type: "integer",
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
