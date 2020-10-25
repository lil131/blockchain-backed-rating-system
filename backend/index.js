const express = require('express');
const app = express();
const Swagger = require('swagger-client');
const bodyparser = require('body-parser');


const movies = {
  1 : {
    id: '111',
    ratingSum: 10,
    ratingCount: 5,
    ratedUsers: ['1','2','3','4','5'],
    userRatings: [1,2,3,2,2]
  },
  2 : {
    id: '222',
    ratingSum: 15,
    ratingCount: 3,
    ratedUsers: ['2','1','5'],
    userRatings: [5,5,5]
  },
  3 : {
    id: '333',
    ratingSum: 1,
    ratingCount: 1,
    ratedUsers: ['3'],
    userRatings: ['1']
  }
};



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
app.post('/api/movie', async (req, res) => {
  try {
    let postRes = await swaggerClient.apis.default.rateMovie_post({
      address: CONTRACT_INSTANCE,
      body: {
        movie_index: req.body.movie_index,
        rating: req.body.rating,
      },
      "kld-from": FROM_ADDRESS,
      "kld-sync": "true"
    });
    res.status(200).send(postRes.body)
    console.log(postRes.body)

  }
  catch(err) {
    res.status(500).send({error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}`});
  }
});

// get movie
app.get('/api/movies/:movie_index', async (req, res) => {
  try {
    console.log(req.params.movie_index)
    let postRes = await swaggerClient.apis.default.getMovie_get({
      address: CONTRACT_INSTANCE,
      movie_index: req.params.movie_index,
      "kld-from": FROM_ADDRESS,
      "kld-sync": "true"
    });
    console.log("req.params.movie_index: ", req.params.movie_index)
    res.status(200).send(postRes.body)
    // console.log(postRes.body)
  }
  catch(err) {
    res.status(500).send({error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}`});
  }
});

// get movie list
app.get('/api/movies', async (req, res) => {
  try {
    let postRes = await swaggerClient.apis.default.getMovieList_get({
      address: CONTRACT_INSTANCE,
      "kld-from": FROM_ADDRESS,
      "kld-sync": "true"
    });
    res.status(200).send(postRes.body)
    // console.log(`postRes.body:`);
    // console.log(postRes);
  }
  catch(err) {
    res.status(500).send({error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}`});
  }
});

// app.post('/api/contract/:address/value', async (req, res) => {
//   try {
//     let postRes = await swaggerClient.apis.default.set_post({
//       address: req.params.address,
//       body: {
//         x: req.body.x,
//       },
//       "kld-from": FROM_ADDRESS,
//       "kld-sync": "true"
//     });
//     res.status(200).send(postRes.body)
//     console.log(postRes.body)

//   }
//   catch(err) {
//     res.status(500).send({error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}`});
//   }
// });

// app.get('/api/contract/:address/value', async (req, res) => {
//   try {
//     let postRes = await swaggerClient.apis.default.get_get({
//       address: req.params.address,
//       body: {
//         x: req.body.x
//       },
//       "kld-from": FROM_ADDRESS,
//       "kld-sync": "true"
//     });
//     res.status(200).send(postRes.body)
//     console.log(postRes.body)
//     console.log(postRes.body.x);
//   }
//   catch(err) {
//     res.status(500).send({error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}`});
//   }
// });
  
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
