module.exports = {
  PORT: 4000,
  // Connectivity details for the node
  // ** Make sure you take the "-connect" URL for your node here, which is the REST API Gateway **
  KALEIDO_REST_GATEWAY_URL: "https://u0n6k18xlh-u0b5tpo22s-connect.us0-aws.kaleido.io/",
  KALEIDO_AUTH_USERNAME: "u0tji1pdcu",
  KALEIDO_AUTH_PASSWORD: "qVSqIdeeSzn_mv2VZeJjwBTQuEA75t6VcXBh-iIVa8c",
  // The "from" address to sign the transactions. Must exist in the node's wallet
  FROM_ADDRESS: "0x15B54C9fbdCc2C86f71a730A286027b99B46A63e",
  // Details of the contract source code in the contracts directory
  // ** if you pull in pre-reqs like OpenZeppelin, just put them all inside the contracts directory **
  CONTRACT_MAIN_SOURCE_FILE: "moviestorage.sol", // filename
  CONTRACT_CLASS_NAME: "moviestorage", // Solidity class within the file

  CONTRACT_INSTANCE: "xxx", // deployed instance
  OPENAPI: "xxx" 
}