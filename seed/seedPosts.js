require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');
const { faker } = require('@faker-js/faker');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        await Post.deleteMany({});
        await User.deleteMany({});

        const users = [];
        for (let i = 0; i < 10; i++) {
            const user = new User({
                username: faker.internet.username(),
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password()
            });
            users.push(user);
        }
        await User.insertMany(users);

        const posts = [];
        for (let i = 0; i < 20; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            let content = faker.lorem.paragraphs(3);
            content = content.substring(0, 500);
            posts.push({
                title: faker.lorem.sentence(),
                content: content,
                
                auther: randomUser._id,
                tags: [faker.word.noun(), faker.word.adjective()]
            });
        }
        await Post.insertMany(posts);
        mongoose.disconnect();
    })
    .catch(err => console.error(err));