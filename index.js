require('dotenv').config();

const express = require('express');

const Posts = require('./data/db.js');

const server = express();
const PORT = process.env.PORT || 6000;

server.use(express.json()); // gives Express the ability to parse the req.body

server.get('/', (req, res) => {
	res.send(`
    <h2>Lambda posts API</h>
    <p>Welcome to the Lambda posts API</p>
  `);
});

server.get('/api/posts', (req, res) => {
	console.log(req.query);
	Posts.find(req.query)
		.then((posts) => {
			res.status(200).json(posts);
		})
		.catch((error) => {
			// log error to database
			console.log(error);
			res.status(500).json({
				message: 'Error retrieving the posts',
			});
		});
});

server.get('/api/posts/:id', (req, res) => {
	posts.findById(req.params.id).then((post) => {
		if (post) {
			res.status(200).json(post);
		} else {
			res.status(404)
				.json({
					message:
						'The post with the specified id could not be retrieved',
				})

				.catch((error) => {
					// log error to database
					console.log(error);
					res.status(500).json({
						message: 'The post information could not be retrieved',
					});
				});
		}
	});

	server.post('/api/posts', (req, res) => {
		const { title, contents } = req.body;
		if (!title || !contents) {
			res.status(400).json(
				`{ errorMessage: "Please provide title and contents for of the post." }`
			);
		} else {
			res.status(201).json(post);
		}

		posts
			.add(req.body)
			.then((hub) => {
				res.status(201).json(hub);
			})
			.catch((error) => {
				// log error to database
				console.log(error);
				res.status(500).json({
					message: 'Error adding the hub',
				});
			});
	});

	server.delete('/api/posts/:id', (req, res) => {
		posts
			.remove(req.params.id)
			.then((count) => {
				if (count > 0) {
					res.status(200).json({ message: 'The hub has been nuked' });
				} else {
					res.status(404).json({
						message: 'The hub could not be found',
					});
				}
			})
			.catch((error) => {
				// log error to database
				console.log(error);
				res.status(500).json({
					message: 'Error removing the hub',
				});
			});
	});

	server.put('/api/posts/:id', (req, res) => {
		const changes = req.body;
		posts
			.update(req.params.id, changes)
			.then((hub) => {
				if (hub) {
					res.status(200).json(hub);
				} else {
					res.status(404).json({
						message: 'The hub could not be found',
					});
				}
			})
			.catch((error) => {
				// log error to database
				console.log(error);
				res.status(500).json({
					message: 'Error updating the hub',
				});
			});
	});

	// add an endpoint that returns all the messages for a hub
	server.get('/api/posts/:id/messages', (req, res) => {
		// we need to find a good function inside the model
		posts
			.findHubMessages(req.params.id)
			.then((data) => {
				// throw new Error('that was arghhhhh!!!!!!')
				console.log(data);
				if (!data.length) {
					res.status(404).json({
						message:
							'No hub with id or n o messages on named hub ' +
							req.params.id,
					});
				} else {
					res.status(200).json(data);
				}
			})
			.catch((error) => {
				console.log(error.message, error.stack);
				res.status(500).json({
					// message: 'that was an error of some sort'
					message: error.message,
					stack: error.stack,
				});
			});
	});
	// add an endpoint for adding new message to a hub
	server.post('/api/messages', (req, res) => {
		posts
			.addMessages(req.body)
			.then((data) => {
				console.log(data);
				res.status(201).json(data);
			})
			.catch((error) => {
				console.log(error.message, error.stack);
				res.status(500);
			});
	});
});

server.listen(PORT, () => {
	console.log(`Server is listening at http://localhost:${PORT}`);
});
