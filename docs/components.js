module.exports = {
	components: {
		schemas: {
			Blog: {
				type: "object",
				properties: {
					_id: {
						type: "string",
						example: "5f9f5c5b9c9d8c0b8c8b8b8b",
					},
					title: {
						type: "string",
						required: true,
						unique: true,
						index: true,
						example: "My First Blog Post",
					},
					description: {
						type: "string",
						example: "This is my first blog post",
					},
					tags: {
						type: "array",
						items: {
							type: "string",
						},
						example: ["blog", "first"],
					},
					author: {
						type: "ref",
						ref: "Users",
						example: "5f9f5c5b9c9d8c0b8c8b8b8b",
					},
					timestamp: {
						type: "Date",
						example: "2020-11-01T00:00:00.000Z",
					},
					imageUrl: {
						type: "string",
						example: "https://picsum.photos/200",
					},
					state: {
						type: "string",
						enum: ["draft", "published"],
						default: "draft",
					},
					readCount: {
						type: "number",
						default: 0,
					},
					readingTime: {
						type: "string",
						example: "1 min read",
					},
					body: {
						type: "string",
						required: true,
						example:
							"This is the body of my first blog post. I am so excited to share this with you all! I hope you enjoy it.",
					},
				},
			},
			User: {
				type: "object",
				properties: {
					firstname: {
						type: "string",
						required: true,
						example: "John",
					},
					lastname: {
						type: "string",
						required: true,
						example: "Doe",
					},
					email: {
						type: "string",
						required: true,
						unique: true,
						index: true,
						example: "johndoe@mail.com",
					},
					password: {
						type: "string",
						required: true,
					},
					articles: {
						type: "array",
						items: {
							type: "ref",
							ref: "Blog",
						},
						example: ["5f9f5c5b9c9d8c0b8c8b8b8b", "5f9f5c5b9c9d8c0b8c8b8b8c"],
					},
				},
			},
			ErrBadRequest: {
				type: "object",
				properties: {
					message: {
						type: "string",
						description: "Error message",
						example: "Bad Request",
					},
					status: {
						type: "number",
						example: 400,
					},
				},
			},
      ErrUnauthorized: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "invalid token or invalid credentials",
            example: "You are not authorized to access this resource",
          },
          status: {
            type: "number",
            example: 401,
          },
        },
      },
      ErrServer: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Error message",
            example: "Internal Server Error",
          },
          status: {
            type: "number",
            example: 500,
          },
        },
      },
      ErrNotFound: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Error message",
            example: "Not Found",
          },
          status: {
            type: "number",
            example: 404,
          },
        },
      },
		},
	},
};
