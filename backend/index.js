const express = require('express');
const path = require('path');
const Swagger = require('swagger-client');
const bodyparser = require('body-parser');
const movieData = require('./data');

const app = express();

let swaggerClient; // Initialized in init()

const {
  KALEIDO_AUTH_USERNAME,
  KALEIDO_AUTH_PASSWORD,
  PORT,
  FROM_ADDRESS,
  CONTRACT_INSTANCE,
  OPENAPI,
} = require('./config');

app.use(bodyparser.json()); 

// rate movie
app.post('/api/movies/:id', async (req, res) => {
  try {
    let postRes = await swaggerClient.apis.default.rateMovie_post({
      address: CONTRACT_INSTANCE,
      body: {
        movie_index: req.params.id,
        rating: req.body.rating,
      },
      "kld-from": FROM_ADDRESS,
      "kld-sync": "true"
    });
    res.status(200).send(postRes.body)

  }
  catch(err) {
    res.status(500).send({error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}`});
  }
});

/* 
  get movie rating
  response:
    {
      averating: float,
      ratingcount: int
    }
*/
app.get('/api/movies/:id', async (req, res) => {
  try {
    let postRes = await swaggerClient.apis.default.getMovie_get({
      address: CONTRACT_INSTANCE,
      movie_index: req.params.id,
      "kld-from": FROM_ADDRESS,
      "kld-sync": "true"
    });
    const ratingsum = postRes.body.ratingsum;
    const ratingcount = postRes.body.ratingcount;
    const averating = ratingcount === 0 ? 0 : Math.round(ratingsum / ratingcount * 10) / 10;
    res.status(200).send({averating: averating, ratingcount: ratingcount});

  } catch(err) {
    res.status(500).send({error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}`});
  }
});

// get movie list
app.get('/api/movies', async (req, res) => {
  try {
    const postRes = await swaggerClient.apis.default.getMovieList_get({
      address: CONTRACT_INSTANCE,
      "kld-from": FROM_ADDRESS,
      "kld-sync": "true"
    });

    const raw = postRes.body.raw;
    const totalRatings = raw[1];
    const counts = raw[2];

    totalRatings.forEach((r, i) => {
      if (i < movieData.length) {
        movieData[i].rating = counts[i] === 0 ? 0 : Math.round(r / counts[i] * 10) / 10;
      }
    });
    counts.forEach((c, i) => {
      if (i < movieData.length) {
        movieData[i].count = c;
      }
    });

    res.status(200).send(movieData.slice(0, 100))
  } catch(err) {
    res.status(500).send({error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}`});
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../frontend/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
  });
}
  
async function init() {
  try {
    // Store a singleton swagger client for us to use
    swaggerClient = await Swagger(OPENAPI, {
      requestInterceptor: req => {
        req.headers.authorization = `Basic ${Buffer.from(`${KALEIDO_AUTH_USERNAME}:${KALEIDO_AUTH_PASSWORD}`).toString("base64")}`;
      }
    });
  
    app.listen(PORT, () => console.log(`Kaleido DApp backend listening on port ${PORT}!`))
  }
  catch(err) {
      console.log(`${err.response && JSON.stringify(err.response.body)}\n${err.stack}`);
  }
};

init().catch(err => {
  console.error(err.stack);
  process.exit(1);
});

module.exports = {
  app
};