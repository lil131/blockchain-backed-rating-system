const request = require('request-promise-native');
const express = require('express');
const app = express();
const archiver = require('archiver');
const Swagger = require('swagger-client');
const {URL} = require('url');
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

const userindex = 2;
let movieindex = 1;


const {
  KALEIDO_REST_GATEWAY_URL,
  KALEIDO_AUTH_USERNAME,
  KALEIDO_AUTH_PASSWORD,
  PORT,
  FROM_ADDRESS,
  CONTRACT_MAIN_SOURCE_FILE,
  CONTRACT_CLASS_NAME
} = require('./config');

let swaggerClient; // Initialized in init()

app.use(bodyparser.json()); 

app.post('/api/contract', async (req, res) => {
  // Note: we really only want to deploy a new instance of the contract
  //       when we are initializing our on-chain state for the first time.
  //       After that the application should keep track of the contract address.
  try {
    let postRes = await swaggerClient.apis.default.constructor_post({
      body: {
        // Here we set the constructor parameters
        x: req.body.x || 'initial value'
      },
      "kld-from": FROM_ADDRESS,
      "kld-sync": "true"
    });
    res.status(200).send(postRes.body)
    console.log("Deployed instance: " + postRes.body.contractAddress);
  }
  catch(err) {
    res.status(500).send({error: `${err.response && JSON.stringify(err.response.body)}\n${err.stack}`});
  }
});

// rate movie
app.post('/api/contract/:address/value', async (req, res) => {
  try {
    let postRes = await swaggerClient.apis.default.rateMovie_post({
      address: req.params.address,
      body: {
        rating: req.body.rating,
        movie_index: req.body.movie_index,
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
app.get('/api/contract/:address/get/:movie_index', async (req, res) => {
  try {
    console.log(req.params.movie_index)
    let postRes = await swaggerClient.apis.default.getMovie_get({
      address: req.params.address,
      body: {
        movie_index: req.params.movie_index
      },
      "kld-from": FROM_ADDRESS,
      "kld-sync": "true"
    });
    console.log("req.params.movie_index: ", req.params.movie_index)
    res.status(200).send(postRes.body)
    console.log(postRes.body)
    console.log('res: ', res.body)
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

  // Kaleido example for compilation of your Smart Contract and generating a REST API
  // --------------------------------------------------------------------------------
  // Sends the contents of your contracts directory up to Kaleido on each startup.
  // Kaleido compiles you code and turns into a REST API (with OpenAPI/Swagger).
  // Instances can then be deployed and queried using this REST API
  // Note: we really only needed when the contract actually changes.  
  const url = new URL(KALEIDO_REST_GATEWAY_URL);
  url.username = KALEIDO_AUTH_USERNAME;
  url.password = KALEIDO_AUTH_PASSWORD;
  url.pathname = "/abis";
  var archive = archiver('zip');  
  archive.directory("contracts", "");
  await archive.finalize();
  let res = await request.post({
    url: url.href,
    qs: {
      compiler: "0.5", // Compiler version
      source: CONTRACT_MAIN_SOURCE_FILE, // Name of the file in the directory
      contract: `${CONTRACT_MAIN_SOURCE_FILE}:${CONTRACT_CLASS_NAME}` // Name of the contract in the 
    },
    json: true,
    headers: {
      'content-type': 'multipart/form-data',
    },
    formData: {
      file: {
        value: archive,
        options: {
          filename: 'smartcontract.zip',
          contentType: 'application/zip',
          knownLength: archive.pointer()    
        }
      }
    }
  });
  // Log out the built-in Kaleido UI you can use to exercise the contract from a browser
  url.pathname = res.path;
  url.search = '?ui';
  console.log(`Generated REST API: ${url}`);
  
  // Store a singleton swagger client for us to use
  swaggerClient = await Swagger(res.openapi, {
    requestInterceptor: req => {
      req.headers.authorization = `Basic ${Buffer.from(`${KALEIDO_AUTH_USERNAME}:${KALEIDO_AUTH_PASSWORD}`).toString("base64")}`;
    }
  });


  app.listen(PORT, () => console.log(`Kaleido DApp backend listening on port ${PORT}!`))
}

init().catch(err => {
  console.error(err.stack);
  process.exit(1);
});
  

module.exports = {
  app
};
