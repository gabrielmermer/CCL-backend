const rssModel = require("../models/rssModel");

function fetchData(req, res) {
	rssModel.fetchData()
		.then(data => {
			console.log('Fetched data:', data);
			res.json(data);
		})
}

module.exports = {
	fetchData
};
