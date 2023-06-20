const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

const rssController = require('./controllers/rssController');

const bodyParser = require('body-parser');

//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

app.use(cors());


const cookieParser = require('cookie-parser');
app.use(cookieParser());

const authenticationService = require('./services/authentication');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//app.get('/rss', rssController.fetchData);
app.get('/rss', authenticationService.authenticateJWT, rssController.fetchData);



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

app.get('/users', rssController.getUsers);
app.route('/login')
	//.get(rssController.getUsers)
	.post(rssController.authenticateUser)
	

// we also log out on the front end
app.get('/logout', (req, res) => {
	console.log("logout starting")
	res.cookie('accessToken', '', {maxAge: 0});
	res.redirect('/')
})

app.post('/register', rssController.createUser) 

app.get('/username/:id', (req, res) => {
	let id = req.params.id
	rssController.getUsername(id, req, res)

})


app.post('/createfeed', rssController.createFeed) 


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

