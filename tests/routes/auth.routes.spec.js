const request = require("supertest");
const moment = require("moment");
const { connect } = require("../database/testDb");
const app = require("../../app");
const { BlogModel, UserModel } = require("../../src/models");

describe("Auth Routes", () => {
	describe("POST /auth/signup", () => {
		let conn;

		beforeAll(async () => {
			conn = await connect();
		});

		afterEach(async () => {
			await conn.cleanup();
		});

		afterAll(async () => {
			await conn.disconnect();
		});

		it("should register a new user", async () => {
			const response = await request(app).post("/auth/signup").send({
				firstname: "John",
				lastname: "Doe",
				email: "john@mail.com",
				password: "password1",
			});
			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty("message", "Signup successful");
			expect(response.body).toHaveProperty("user");
			expect(response.body.user).toHaveProperty("firstname", "John");
			expect(response.body.user).toHaveProperty("lastname", "Doe");
			expect(response.body.user).toHaveProperty("email", "john@mail.com");
		});

		it("should not register a new user with an existing email", async () => {
			const user = await UserModel.create({
				firstname: "John",
				lastname: "Doe",
				email: "john@mail.com",
				password: "password1",
			});
			const response = await request(app).post("/auth/signup").send({
				firstname: "John",
				lastname: "Doe",
				email: "john@mail.com",
				password: "password1",
			});
			expect(response.status).toBe(500);
		});
	});

	describe("POST /auth/login", () => {
		let conn;

		beforeAll(async () => {
			conn = await connect();
		});

		afterEach(async () => {
			await conn.cleanup();
		});

		afterAll(async () => {
			await conn.disconnect();
		});

		it("should login a user", async () => {
			const user = await UserModel.create({
				firstname: "John",
				lastname: "Doe",
				email: "john@mail.com",
				password: "password1",
			});

			const response = await request(app).post("/auth/login").send({
				email: "john@mail.com",
				password: "password1",
			});

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("message", "Login successful");
			expect(response.body).toHaveProperty("token");
		});

		it("should not login a user with an invalid password", async () => {
			const user = await UserModel.create({
				firstname: "John",
				lastname: "Doe",
				email: "john@mail.com",
				password: "password1",
			});

			const response = await request(app).post("/auth/login").send({
				email: "john@mail.com",
				password: "password2",
			});

			expect(response.status).toBe(401);
			expect(response.body).toHaveProperty("message", "email or password is incorrect");
		});

		it("should not login a user with an unregistered email", async () => {
			const response = await request(app).post("/auth/login").send({
				email: "john@mail.com",
				password: "password1",
			});

			expect(response.status).toBe(401);
			expect(response.body).toHaveProperty("message", "email or password is incorrect");
		});
	});
});
