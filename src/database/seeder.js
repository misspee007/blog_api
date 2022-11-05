// require("dotenv").config();
const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
const { UserModel, BlogModel } = require("../models");
const { blogService } = require("../services");
require("dotenv").config();

mongoose
	.connect(process.env.MONGODB_CONNECTION_URL)
	.then(() => {
		console.log("Connected to database");
	})
	.catch((error) => {
		console.log(`connection string: ${process.env.MONGODB_CONNECTION_URL}`);
		console.log(`port: ${process.env.PORT}`);
		console.log("Error connecting to database", error);
	});

async function seedDB() {
	try {
		// delete all users and blogs
		const dbUsers = await UserModel.find({});
		const userIds = dbUsers.map((user) => user._id.toString());

		await UserModel.deleteMany({ _id: { $in: userIds } });
		await BlogModel.deleteMany({ author: { $in: userIds } });

		console.log("Database cleared");

		const users = [];
		for (let i = 0; i < 22; i++) {
			const user = {
        _id: mongoose.Types.ObjectId(),
				firstname: faker.name.firstName(),
				lastname: faker.name.lastName(),
				email: faker.internet.email(),
				password: "fakepassword",
				articles: [],
			};
			users.push(user);
		}

		const blogs = [];
		for (let i = 0; i < 22; i++) {
			const body = faker.lorem.paragraphs(20);
			const readingTime = blogService.calculateReadingTime(body);
			blogs.push({
        _id: mongoose.Types.ObjectId(),
				title: faker.lorem.sentence(),
				description: faker.lorem.paragraph(),
				tags: faker.lorem.words(3).split(" "),
				author: users[i]._id,
				timestamp: faker.date.past().toISOString(),
				state: "published",
				body: body,
				readCount: Math.round(faker.random.numeric(2)),
				readingTime: `${readingTime} min read`,
			});
		}

		// add blogs to users
		for (let i = 0; i < 22; i++) {
			users[i].articles[0] = blogs[i]._id;
		}

    // save all users and blogs
    await UserModel.insertMany(users);
    await BlogModel.insertMany(blogs);

		console.log("Seeded DB!");
	} catch (error) {
		console.log(error);
	}
}

seedDB().then(() => {
	mongoose.connection.close();
});
