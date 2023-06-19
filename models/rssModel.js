const NodeCache = require('node-cache');
const cache = new NodeCache();

let Parser = require('rss-parser');
let parser = new Parser();

const db = require('../services/database.js').config;

async function fetchData() {
  const cacheKey = 'feedData';

  // Check if the data is already cached
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log('Returning cached feed data:');
    return cachedData;
  }

  try {

    let feed = await parser.parseURL('https://www.stol.it/rss/feed/AlleRessorts');
    console.log('Parsed feed:');

    // Cache the fetched data
    cache.set(cacheKey, feed);

    return feed;
  } catch (err) {
    console.error('Error while fetching/parsing RSS:', err);
    throw err;
  }
}

async function fetchFeed(url) {
  const cacheKey = `feedData-${url}`;

  // Check if the data is already cached
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log('Returning cached feed data:');
    return cachedData;
  }

  try {
    console.log(url);
    let newurl = 'https://' + url;
    console.log(newurl);
    let feed = await parser.parseURL(newurl);

    // Cache the fetched data
    cache.set(cacheKey, feed);

    return feed;
  } catch (err) {
    console.error('Error while fetching/parsing RSS:', err);
    throw err;
  }
}

let getFeeds = (username) => new Promise((resolve, reject) => {
  const cacheKey = `userFeeds-${username}`;

  // Check if the data is already cached
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log('Returning cached user feeds:');
    resolve(cachedData);
  } else {
    db.query("SELECT * FROM CCL_feeds WHERE username =" + db.escape(username), function (err, users, fields) {
      if (err) {
        reject(err);
      } else {
        // Cache the fetched data
        cache.set(cacheKey, users);
        resolve(users);
      }
    });
  }
});



// auth
let getUsers = () => new Promise((resolve, reject) => {
    db.query("SELECT * FROM CCL_users", function (err, users, fields) {
        if (err) {
            reject(err);
        } else {
            resolve(users);
        }
    })
});
module.exports = {
	fetchData,
	fetchFeed,
	getFeeds,
	getUsers
};

