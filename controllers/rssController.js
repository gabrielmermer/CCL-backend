const rssModel = require("../models/rssModel");
const authenticationService = require('../services/authentication');

function fetchData(req, res) {
	rssModel.fetchData()
		.then(data => {
			//console.log('Fetched data:', data);
			res.json(data);
		})
}

const fetchFeed = async (url, res) => {
	try {
		//console.log('controller url: ' + url);
		const data = await rssModel.fetchFeed(url);
		//console.log(data);
		//console.log(typeof(data));
		return data;
	} catch (error) {
		console.error('Error fetching the feed:', error);
		res.status(500).send('Error fetching the feed');
	}
};


function getFeeds(req, res, next) {
	let username = req.params.id;
	rssModel.getFeeds(username)
		.then(data => {
			//console.log('Fetched data:', data);
			res.json(data);
		})
}

function getUsers(req, res) {
	rssModel.getUsers()
		.then(data => {
			res.json(data);
		})

}

function createUser(req, res) {
  console.log(req.body);
  let username = req.body.username;
  let password = req.body.password;
  console.log(username, password);

  rssModel.createUser(username, password)
    .then(() => {
      //res.redirect("http://localhost:5173/rss");
      res.redirect("http://localhost:5173/");
    })
    .catch((err) => {
      // Handle the error
      console.error(err);
      res.sendStatus(500);
    });
}



function authenticateUser(req, res, next) {
		rssModel.getUsers()
			.then((users) => {
				console.log("passing users to authentication.js: ", users)
				console.log("req body:", req.body);
				authenticationService.authenticateUser(req, users, res)
			})
			.catch((err) => {
				console.log(err);
				res.sendStatus(500)
			})

}

function getUsername(id, req, res, next) {
	rssModel.getUsername(id)
		.then(data => {
			console.log('Fetched data:', data);
			res.json(data)
		})
		.catch(error => {
			console.error(error);
		});
}


function createFeed(req, res, next) {
	const { username, feedName, feedUrl } = req.body;
	rssModel.createFeed(username, feedName, feedUrl)
		.then(data => {
			console.log('Fetched data:', data);
			res.redirect("http://localhost:5173/rss");
		})
		.catch(error => {
			console.error(error);
		});
}


function deleteFeed(req, res, next) {
	const { username, feedName, feedUrl } = req.body;
	console.log("Deltefeed controller fired")
	rssModel.deleteFeed(username, feedName, feedUrl)
		.then(data => {
			//console.log('Fetched data:', data);
			console.log(data)

			res.redirect("http://localhost:5173/rss");
			res.sendStatus(200)
		})
		.catch(error => {
			console.error(error);
		});
}
module.exports = {
	fetchData,
	fetchFeed,
	getFeeds,
	getUsers,
	authenticateUser,
	createUser,
	getUsername,
	createFeed,
	deleteFeed

};
