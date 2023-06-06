let Parser = require('rss-parser');
let parser = new Parser();

async function fetchData() {
  try {
    let feed = await parser.parseURL('https://www.reddit.com/r/polska/.rss');
    console.log('Parsed feed:');
    return feed;
  } catch (err) {
    console.error('Error while fetching/parsing RSS:', err);
    throw err;
  }
}


module.exports = {
  fetchData
};

