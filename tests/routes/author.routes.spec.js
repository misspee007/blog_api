const request = require("supertest");
const moment = require("moment");
const { connect } = require("../database/testDb");
const app = require("../../app");
const { BlogModel, UserModel } = require("../../src/models");
const { blogService } = require("../../src/services");

describe("GET /author/blog: Get Published Articles", () => {
	let conn;
	let authorId;
	let token;

	beforeAll(async () => {
		conn = await connect();

		// Create a user and get user id
		await UserModel.create({
			email: "pda@mail.com",
			password: "123456",
			firstname: "precious",
			lastname: "abubakar",
		});
		const user = await UserModel.findOne({ email: "pda@mail.com" });
		userId = user._id;

		// login user and get token
		const loginResponse = await request(app)
			.post("/auth/login")
			.set("content-type", "application/json")
			.send({
				email: "pda@mail.com",
				password: "123456",
			});

		token = loginResponse.body.token;
	});

	afterEach(async () => {
		await conn.cleanup();
	});

	afterAll(async () => {
		await conn.disconnect();
	});

	it("should return all articles created by the logged in user", async () => {
		// create article in our db
		const readingTime = blogService.calculateReadingTime(
			"This is the body of the article"
		);

		const article = await BlogModel.create({
			title: "This is an article by the logged in user",
			body: "This is the body of the article",
			description: "An article",
			tags: ["one", "test"],
			state: "draft",
			author: userId.toString(),
			timestamp: moment().toDate(),
			readingTime: readingTime,
		});

		// add article to user's articles
		await UserModel.updateOne(
			{ _id: userId },
			{ $push: { articles: article._id } }
		);

		// add an article created by another user
		const article2 = await BlogModel.create({
			title: "This is an article by a random user",
			body: "This is the body of the article",
			description: "An article",
			tags: ["two", "test"],
			state: "published",
			timestamp: moment().toDate(),
			readingTime: readingTime,
		});

		// check if article1 and article2 have been created before making get request
		// if (article1 && article2) {
		const response = await request(app)
			.get("/author/blog")
			.set("content-type", "application/json")
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("articles");
		expect(response.body).toHaveProperty("message", "Request successful");
		// check that the articles have the correct properties
		expect(response.body.articles[0]).toHaveProperty("title");
		expect(response.body.articles[0]).toHaveProperty("body");
		expect(response.body.articles[0]).toHaveProperty("description");
		expect(response.body.articles[0]).toHaveProperty("tags");
		expect(response.body.articles[0]).toHaveProperty("state");
		expect(response.body.articles[0]).toHaveProperty("author");
		expect(response.body.articles[0]).toHaveProperty("timestamp");
		expect(response.body.articles[0]).toHaveProperty("readingTime");
		expect(response.body.articles[0]).toHaveProperty("readCount");
		expect(response.body.articles[0]).toHaveProperty("_id");
		// expect(response.body.articles[0].state).toBe("published");
		expect(response.body.articles[0].readCount).toBe(0);
		// check that the tags are returned as an array
		expect(Array.isArray(response.body.articles[0].tags)).toBe(true);
		expect(response.body.articles[0].tags.length).toBe(2);
		expect(typeof response.body.articles[0].author).toBe("string");
		// }
	});

	it("should return 401 Unauthorized for a client that has no token", async () => {
		const response = await request(app)
			.get("/author/blog")
			.set("content-type", "application/json");

		expect(response.status).toBe(401);
		expect(response.text).toBe("Unauthorized");
	});
});

describe("POST /author/blog: Create New Article", () => {
	let conn;
	let token;

	beforeAll(async () => {
		conn = await connect();

		// Create a user
		await UserModel.create({
			email: "pda@mail.com",
			password: "123456",
			firstname: "precious",
			lastname: "abubakar",
		});

		// login user and get token
		const loginResponse = await request(app)
			.post("/auth/login")
			.set("content-type", "application/json")
			.send({
				email: "pda@mail.com",
				password: "123456",
			});

		token = loginResponse.body.token;
	});

	afterEach(async () => {
		await conn.cleanup();
	});

	afterAll(async () => {
		await conn.disconnect();
	});

	// test the create article route
	it("should create a new article in draft state", async () => {
		const response = await request(app)
			.post("/author/blog")
			.set("content-type", "application/json")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "This is an article by the logged in user",
				body: "This is the body of the article",
				description: "An article",
				tags: "one,test",
			});

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty("article");
		expect(response.body).toHaveProperty(
			"message",
			"Article created successfully"
		);

		// check that the article has the correct properties
		expect(response.body.article).toHaveProperty("title");
		expect(response.body.article).toHaveProperty("body");
		expect(response.body.article).toHaveProperty("description");
		expect(response.body.article).toHaveProperty("tags");
		expect(response.body.article).toHaveProperty("state");
		expect(response.body.article).toHaveProperty("author");
		expect(typeof response.body.article.author).toBe("string");
		expect(response.body.article).toHaveProperty("timestamp");
		expect(response.body.article).toHaveProperty("readingTime");
		expect(response.body.article).toHaveProperty("readCount");
		expect(response.body.article).toHaveProperty("_id");

		// check that the article is in draft state
		expect(response.body.article.state).toBe("draft");

		// check that read count = 0
		expect(response.body.article.readCount).toBe(0);

		// check that the tags are returned as an array
		expect(Array.isArray(response.body.article.tags)).toBe(true);
		expect(response.body.article.tags.length).toBe(2);
	});

	it("should return 401 Unauthorized for a client that has no token", async () => {
		const response = await request(app)
			.post("/author/blog")
			.set("content-type", "application/json")
			.send({
				title: "This is an article by a random user",
				body: "This is the body of the article",
				description: "An article",
				tags: "one,test",
			});

		expect(response.status).toBe(401);
		expect(response.text).toBe("Unauthorized");
	});
});

describe("PATCH /author/blog/edit/state/:id: Change Article State", () => {
	let conn;
	let userId;
	let token;
	let articleId;

	beforeAll(async () => {
		conn = await connect();

		// Create a user and get the id
		await UserModel.create({
			email: "pda@mail.com",
			password: "123456",
			firstname: "precious",
			lastname: "abubakar",
		});
		const user = await UserModel.findOne({ email: "pda@mail.com" });
		userId = user._id;

		// login user and get token
		const loginResponse = await request(app)
			.post("/auth/login")
			.set("content-type", "application/json")
			.send({
				email: "pda@mail.com",
				password: "123456",
			});

		token = loginResponse.body.token;

		// create an article and get the id
		const article = await BlogModel.create({
			title: "This is an article by the logged in user",
			body: "This is the body of the article",
			description: "An article",
			tags: "one,test",
			author: userId.toString(),
		});
		articleId = article._id;
	});

	afterAll(async () => {
		await conn.cleanup();
		await conn.disconnect();
	});

	it("should return an article with the state updated from draft to published", async () => {
		const response = await request(app)
			.patch(`/author/blog/edit/state/${articleId}`)
			.set("content-type", "application/json")
			.set("Authorization", `Bearer ${token}`)
			.send({
				state: "published",
			});

		// check that the correct article is returned
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty(
			"message",
			"State successfully updated"
		);
		expect(response.body).toHaveProperty("article");
		expect(response.body.article).toHaveProperty("state", "published");
	});

	it("should return 401 Unauthorized for a client that has no token", async () => {
		const response = await request(app)
			.patch(`/author/blog/edit/state/${articleId}`)
			.set("content-type", "application/json")
			.send({
				state: "published",
			});

		expect(response.status).toBe(401);
		expect(response.text).toBe("Unauthorized");
	});

	it("should return 400 Bad Request if the new state is anything except draft or published", async () => {
		const response = await request(app)
			.patch(`/author/blog/edit/state/${articleId}`)
			.set("content-type", "application/json")
			.set("Authorization", `Bearer ${token}`)
			.send({
				state: "new",
			});

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("error", "Invalid state");
	});

	it("should return 404 Not Found if the articleId parameter is invalid", async () => {
		const response = await request(app)
			.patch("/author/blog/state/123")
			.set("content-type", "application/json")
			.set("Authorization", `Bearer ${token}`)
			.send({
				state: "draft",
			});

		expect(response.status).toBe(404);
		expect(response.body).toHaveProperty("message", "Route not found");
	});

	it("should return 400 Bad Request if the article's current state is the same as the new state", async () => {
		const response = await request(app)
			.patch(`/author/blog/edit/state/${articleId}`)
			.set("content-type", "application/json")
			.set("Authorization", `Bearer ${token}`)
			.send({
				state: "published",
			});

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty(
			"error",
			"Article is already in published state"
		);
	});
});

describe("PATCH /author/blog/edit/:id: Edit Article", () => {
	let conn;
	let authorId;
	let authorToken;
	let randomUserToken;
	let articleId;

	beforeAll(async () => {
		conn = await connect();

		// Create a user and get the id
		await UserModel.create({
			email: "pda@mail.com",
			password: "123456",
			firstname: "precious",
			lastname: "abubakar",
		});
		await UserModel.create({
			email: "test@mail.com",
			password: "123456",
			firstname: "test",
			lastname: "test",
		});
		const users = await UserModel.find({}).sort({ lastname: "asc" });
		authorId = users[0]._id;

		// login users and get tokens
		const authorLoginResponse = await request(app)
			.post("/auth/login")
			.set("content-type", "application/json")
			.send({
				email: "pda@mail.com",
				password: "123456",
			});

		const userLoginResponse = await request(app)
			.post("/auth/login")
			.set("content-type", "application/json")
			.send({
				email: "test@mail.com",
				password: "123456",
			});

		authorToken = authorLoginResponse.body.token;
		randomUserToken = userLoginResponse.body.token;

		// create an article and get the id
		const article = await BlogModel.create({
			title: "This is an article by the logged in user",
			body: "This is the body of the article",
			description: "An article",
			tags: "one,test",
			author: authorId.toString(),
		});
		articleId = article._id;
	});

	afterAll(async () => {
		await conn.cleanup();
		await conn.disconnect();
	});

	it("should return the updated article", async () => {
		const response = await request(app)
			.patch(`/author/blog/edit/${articleId}`)
			.set("content-type", "application/json")
			.set("Authorization", `Bearer ${authorToken}`)
			.send({
				body: "I edited this article. I hope you enjoyed reading it.",
			});

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty(
			"message",
			"Article successfully edited and saved"
		);
		expect(response.body).toHaveProperty("article");
		expect(response.body.article.body).toBe(
			"I edited this article. I hope you enjoyed reading it."
		);
	});

	it("should return 401 Unauthorized for a client that has no token", async () => {
		const response = await request(app)
			.patch(`/author/blog/edit/${articleId}`)
			.set("content-type", "application/json")
			.send({
				title: "I edited this article",
			});

		expect(response.status).toBe(401);
		expect(response.text).toBe("Unauthorized");
	});

	it("should return 401 if the token does not belong to the author of the article", async () => {
		const response = await request(app)
			.patch(`/author/blog/edit/${articleId}`)
			.set("content-type", "application/json")
			.set("Authorization", `Bearer ${randomUserToken}`)
			.send({
				title: "I edited this article",
			});

		expect(response.status).toBe(401);
		expect(response.body).toHaveProperty(
			"error",
			"You are not authorized to access this resource"
		);
	});

	it("should return error if the articleId parameter is invalid", async () => {
		const response = await request(app)
			.patch("/author/blog/edit/123")
			.set("content-type", "application/json")
			.set("Authorization", `Bearer ${authorToken}`)
			.send({
				title: "I edited this article",
			});

		expect(response.status).toBe(500);
	});
});

describe("DELETE /author/blog/delete/:id: Delete Article", () => {
	let conn;
	let authorId;
	let authorToken;
	let randomUserToken;
	let articleId;

	beforeAll(async () => {
		conn = await connect();

		// Create a user and get the id
		await UserModel.create({
			email: "pda@mail.com",
			password: "123456",
			firstname: "precious",
			lastname: "abubakar",
		});
		await UserModel.create({
			email: "test@mail.com",
			password: "123456",
			firstname: "test",
			lastname: "test",
		});
		const users = await UserModel.find({}).sort({ lastname: "asc" });
		authorId = users[0]._id;

		// login users and get tokens
		const authorLoginResponse = await request(app)
			.post("/auth/login")
			.set("content-type", "application/json")
			.send({
				email: "pda@mail.com",
				password: "123456",
			});

		const userLoginResponse = await request(app)
			.post("/auth/login")
			.set("content-type", "application/json")
			.send({
				email: "test@mail.com",
				password: "123456",
			});

		authorToken = authorLoginResponse.body.token;
		randomUserToken = userLoginResponse.body.token;

		// create an article and get the id
		const article = await BlogModel.create({
			title: "This is an article by the logged in user",
			body: "This is the body of the article",
			description: "An article",
			tags: "one,test",
			author: authorId,
		});
		articleId = article._id;
	});

	afterAll(async () => {
		await conn.cleanup();
		await conn.disconnect();
	});

	it("should return 401 Unauthorized for a client that has no token", async () => {
		const response = await request(app)
			.delete(`/author/blog/delete/${articleId}`)
			.set("content-type", "application/json");

		expect(response.status).toBe(401);
		expect(response.text).toBe("Unauthorized");
	});

	it("should return 401 if the token does not belong to the author of the article", async () => {
		const response = await request(app)
			.delete(`/author/blog/delete/${articleId}`)
			.set("content-type", "application/json")
			.set("Authorization", `Bearer ${randomUserToken}`);

		expect(response.status).toBe(401);
		expect(response.body).toHaveProperty(
			"error",
			"You are not authorized to access this resource"
		);
	});

	it("should return error if the articleId parameter is invalid", async () => {
		const response = await request(app)
			.delete("/author/blog/delete/123")
			.set("content-type", "application/json")
			.set("Authorization", `Bearer ${authorToken}`);

		// check if response.status is greater than 300
		expect(response.status).not.toBe(200);
	});

	it("should remove article from the database", async () => {
		const response = await request(app)
			.delete(`/author/blog/delete/${articleId}`)
			.set("content-type", "application/json")
			.set("Authorization", `Bearer ${authorToken}`);

		const article = await BlogModel.findById(articleId);
		expect(article).toBeNull();
	});
});
