// const request = require("supertest");
// const app = require("../../app");
// const { UserModel } = require("../../src/models");
// const { connectDB, disconnectDB } = require("../database/testDb");

// describe("Auth: Signup and Login", () => {
//   // Connect to a new in-memory database before running any tests
// 	beforeAll(async () => {
//     await connectDB();
//     app.listen(3000);
// 	});

// 	afterEach(async () => {

// 	});

// 	afterAll(async () => {
// 		disconnectDB();
//     // close server

// 	});

// 	it("should signup a user", async () => {
// 		const response = await request(app)
// 			.post("/auth/signup")
// 			.set("content-type", "application/json")
// 			.send({
// 				password: "mypassword",
// 				firstname: "Robyn",
// 				lastname: "Fenty",
// 				email: "badgalrir@fenty.com",
// 			});

// 		expect(response.status).toBe(201);
// 		expect(response.body).toHaveProperty("message");
// 		expect(response.body).toHaveProperty("user");
// 		expect(response.body.user).toHaveProperty("firstname", "Robyn");
// 		expect(response.body.user).toHaveProperty("lastname", "Fenty");
// 		expect(response.body.user).toHaveProperty("email", "badgalrir@fenty.com");
// 	}, 60000);

// 	it("should login a user", async () => {
// 		// create user in db
// 		const user = await UserModel.create({
// 			email: "rir@fentybeauty.com",
// 			password: "mypassword",
// 			firstname: "Robyn",
// 			lastname: "Fenty",
// 		});

// 		// login user
// 		const response = await request(app)
// 			.post("/auth/login")
// 			.set("content-type", "application/json")
// 			.send({
// 				email: "rir@fentybeauty.com",
// 				password: "mypassword",
// 			});

// 		expect(response.status).toBe(200);
// 		expect(response.body).toHaveProperty("message");
// 		expect(response.body).toHaveProperty("token");
// 	});
// }, 60000);
