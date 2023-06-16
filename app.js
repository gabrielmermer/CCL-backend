
const express = require('express')
const app = express()
const port = 3000

const rssController = require('./controllers/rssController');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/rss', rssController.fetchData);

app.get('/rss/:url(*)', (req, res) => {
	const url = req.params.url;
	console.log('url: ' + url);
	rssController.fetchFeed(url)
		.then((feed) => {
			// Handle the fetched feed
			res.send(feed);
		})
		.catch((error) => {
			// Handle the error
			res.status(500).send('Error fetching the feed');
		});
});

app.get('/feeds/:id', rssController.getFeeds);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

