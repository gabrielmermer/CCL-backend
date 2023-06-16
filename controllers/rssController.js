const rssModel = require("../models/rssModel");

function fetchData(req, res) {
	rssModel.fetchData()
		.then(data => {
			console.log('Fetched data:', data);
			res.json(data);
		})
}

const fetchFeed = async (url, res) => {
	try {
		console.log('controller url: ' + url);
		const data = await rssModel.fetchFeed(url);
		console.log(data);
		console.log(typeof(data));
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
			console.log('Fetched data:', data);
			res.json(data);
		})
}

module.exports = {
	fetchData,
	fetchFeed,
	getFeeds

};
