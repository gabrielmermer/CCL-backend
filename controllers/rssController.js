const rssModel = require("../models/rssModel");

function fetchData(req, res) {
	rssModel.fetchData()

};


module.exports = {
	fetchData
}
