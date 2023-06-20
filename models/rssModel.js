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
	return {
		"feed": "404"
	}
    throw err;
  }
}

let getFeeds = (username) => new Promise((resolve, reject) => {
  db.query("SELECT * FROM CCL_feeds WHERE username =" + db.escape(username), function (err, users, fields) {
    if (err) {
      reject(err);
    } else {
      resolve(users);
    }
  });
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

function createUser(name, password)  {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO CCL_users (username,password) VALUES (?, ?)';
        db.query(sql, [name, password], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}


let getUsername = (id) => new Promise((resolve, reject) => {
    db.query("SELECT username FROM CCL_users where id = ?",[id], function (err, users, fields) {
        if (err) {
            reject(err);
        } else {
            resolve(users);
        }
    })
});



function createFeed(username, feed_name, feed_url)  {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO CCL_feeds (username,feed_name, feed_url) VALUES (?, ?, ?)';
        db.query(sql, [username, feed_name, feed_url], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function deleteFeed(username, feed_name, feed_url) {
  console.log("username ", username);
  console.log("feed url ", feed_url);
  console.log("feed_name ", feed_name);
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM CCL_feeds WHERE username = ? AND feed_url = ? AND feed_name = ?';
    db.query(sql, [username, feed_url, feed_name], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}


module.exports = {
	fetchData,
	fetchFeed,
	getFeeds,
	getUsers,
	createUser,
	getUsername,
	createFeed,
	deleteFeed
};

