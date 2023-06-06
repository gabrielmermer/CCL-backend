
const express = require('express')
const app = express()
const port = 3000

const rssController = require('./controllers/rssController');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/rss', rssController.fetchData);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

