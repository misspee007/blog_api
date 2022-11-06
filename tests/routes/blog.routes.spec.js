const request = require("supertest");
const moment = require("moment");
const { connect } = require("../database/testDb");
const app = require("../../app");
const { BlogModel, UserModel } = require("../../src/models");
const { blogService } = require("../../src/services");

describe("Blog Route: Get Published Articles", () => {
	let conn;
	let userId;

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
	});

	afterEach(async () => {
		await conn.cleanup();
	});

	afterAll(async () => {
		await conn.disconnect();
	});

	it("should return published articles", async () => {
		// create article in our db
		const readingTime = blogService.calculateReadingTime(
			"This is the body of the article"
		);

		await BlogModel.insertMany([
			{
				title: "This is the first test article",
				body: "This is the body of the article",
				description: "An article",
				tags: ["one", "test"],
				state: "published",
				author: userId,
				timestamp: moment().toDate(),
				readingTime: readingTime,
			},
			{
				title: "This is a second test article",
				body: "This is the body of the article",
				description: "An article",
				tags: ["two", "test"],
				state: "published",
				author: userId,
				timestamp: moment().toDate(),
				readingTime: readingTime,
			},
		]);

		const response = await request(app)
			.get("/blog")
			.set("content-type", "application/json");

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("articles");
		expect(response.body).toHaveProperty("message", "Request successful");
		// check that only published articles are returned
		expect(
			response.body.articles.every((article) => article.state === "published")
		).toBe(true);
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
		expect(response.body.articles[0].state).toBe("published");
		expect(response.body.articles[0].readCount).toBe(0);
		// check that the tags are returned as an array
		expect(Array.isArray(response.body.articles[0].tags)).toBe(true);
		expect(response.body.articles[0].tags.length).toBe(2);
		// check that the author is returned as an object
		expect(typeof response.body.articles[0].author).toBe("object");
	});
});

describe("Blog Route: Get Article by Id", () => {
	let conn;
	let userId;

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
	});

	afterEach(async () => {
		await conn.cleanup();
	});

	afterAll(async () => {
		await conn.disconnect();
	});

	it("should return an article with the specified id and increment the read count", async () => {
		// write a test to check that an article with the specified id is returned

		// create article in our db
		const readingTime = blogService.calculateReadingTime(
			"This is the body of the article"
		);

		await BlogModel.create({
			title: "This is a test article",
			body: "This is the body of the article",
			description: "An article",
			tags: ["one", "test"],
			state: "published",
			author: userId,
			timestamp: moment().toDate(),
			readingTime: readingTime,
		});

		// get the id of the article we just created
		const article = await BlogModel.findOne({
			title: "This is a test article",
		});

		// make a request to get the article by id
		const response = await request(app)
			.get(`/blog/${article._id}`)
			.set("content-type", "application/json");

		// check that the correct article is returned
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("article");
		expect(response.body).toHaveProperty("message", "Request successful");
		expect(response.body.article).toHaveProperty("title");
		expect(response.body.article).toHaveProperty("body");
		expect(response.body.article).toHaveProperty("description");
		expect(response.body.article).toHaveProperty("tags");
		expect(response.body.article).toHaveProperty("state");
		expect(response.body.article).toHaveProperty("author");
		expect(response.body.article).toHaveProperty("timestamp");
		expect(response.body.article).toHaveProperty("readingTime");
		expect(response.body.article).toHaveProperty("readCount");
		expect(response.body.article).toHaveProperty("_id");
		expect(response.body.article.title).toBe("This is a test article");
		expect(response.body.article.body).toBe("This is the body of the article");
		expect(response.body.article.description).toBe("An article");
		expect(response.body.article.state).toBe("published");
		expect(response.body.article.readCount).toBe(1);
		expect(Array.isArray(response.body.article.tags)).toBe(true);
		expect(response.body.article.tags.length).toBe(2);
		expect(response.body.article.tags[0]).toBe("one");
		expect(response.body.article.tags[1]).toBe("test");
	});
});
