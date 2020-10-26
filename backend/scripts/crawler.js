/*
  Crawl IMDB Movie List
*/

const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const pLimit = require('p-limit');

const PREFIX = 'https://www.imdb.com';
const LIST_URL = 'https://www.imdb.com/chart/top-english-movies';
const OUTPUT = '../data.json';
const CONCURRENT_LIMIT = 25;

async function getList() {
  const res = await axios.get(LIST_URL)
  const content = res.data;
  const $ = cheerio.load(content);

  const list = $('.lister .lister-list .titleColumn > a').map((i, ele) => $(ele).attr('href')).toArray();
  return list.map(s => s.slice(0, s.indexOf('?')));
}

async function getMedia(url) {
  const res = await axios.get(url);
  const content = res.data;
  const $ = cheerio.load(content);

  return $('.media_index_thumb_list img').slice(0, 10).map((i, ele) => $(ele).attr('src')).toArray();
}

async function getItem(idx, url) {
  const imdbUrl = PREFIX + url;
  const res = await axios.get(imdbUrl);
  const content = res.data;
  const $ = cheerio.load(content);

  const entity = {
    id: idx,
    title: $('.title_wrapper > h1').get(0).childNodes[0].nodeValue.trim(),
    year: parseInt($('#titleYear > a').text()),
    length: $('.title_wrapper > .subtext > time').text().trim(),
    category: $('.title_wrapper > .subtext > a').first().text().trim(),
    desc: $('.summary_text').text().trim(),
    directors: $('.plot_summary .credit_summary_item > a').map((i, ele) => $(ele).text().trim()).toArray(),
    stars: $('.cast_list tr').slice(1, 8).map((i, ele) => $($(ele).find('td').get(1)).find('a').text().trim()).toArray(),
    img: $('.poster > a > img').attr('src'),
    photos: await getMedia(imdbUrl + 'mediaindex'),
    imdbUrl: imdbUrl
  };

  return entity;
}

async function main() {
  const list = await getList();

  // concurrent request limit
  const limit = pLimit(CONCURRENT_LIMIT);

  const movies = await Promise.all(
    list.map((item, idx) => limit(() => getItem(idx, item)))
  );

  fs.writeFileSync(OUTPUT, JSON.stringify(movies, null, 2));
}

main().catch(err => {
  console.error(err);
});
