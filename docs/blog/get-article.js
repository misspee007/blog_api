module.exports = {
	get: {
		tags: ["Blog Read Operations"],
		description: "Get a single article",
		operationId: "getArticle",
		parameters: [
			{
				name: "id",
				in: "path",
				description: "Article ID",
				required: true,
				schema: {
					$ref: "#/components/schemas/Blog/properties/_id",
				},
			},
		],
		responses: {
			200: {
				description: "Article found",
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/Blog",
						},
						example: {
							message: "Request successful",
							article: {
								_id: "6366cd18b34b65410bc391db",
								title: "We Are Still Testing The Routes",
								description: "An updated article",
								tags: ["blog", "test", "edit"],
								author: {
									_id: "6366b10174282b915e1be028",
									firstname: "Clark",
									lastname: "Boyer",
									email: "Cleo27@hotmail.com",
								},
								timestamp: "2022-11-05T21:27:22.516Z",
								state: "published",
								readCount: 1,
								readingTime: "1 min",
								body: "This is the body of the article. I hope you enjoyed reading it.",
								__v: 1,
							},
						},
					},
				},
			},
			404: {
				description: "Article not found",
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/ErrNotFound",
						},
					},
				},
			},
			500: {
				description: "Server error",
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
