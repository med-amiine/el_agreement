const pcl = require('postchain-client');

// const node_api_url = "https://try.chromia.dev/node/YOURNODEID/"; // Node id is displayed under https://try.chromia.dev/

// If you are using ECLIPSE instead use this url BELOW
const node_api_url = "http://localhost:7740"; // using default postchain node REST API port

// default blockchain identifier used for testing 
// const blockchainRID = "78967baa4768cbcef11c508326ffb13a956689fcb6dc3ba17f4b895cbb1577a3"; // Default blockchainRID under https://try.chromia.dev/
const blockchainRID = "0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF"; // Default blockchainRID under ECLIPSE


// Create the rest client
const rest = pcl.restClient.createRestClient(node_api_url, blockchainRID, 5);

// create GTX rest client (chromia tx format)
const gtx = pcl.gtxClient.createClient(
    rest,
    Buffer.from(blockchainRID, 'hex'),
    [] );


( async () => {
    // generating a keypair
	const keys = pcl.util.makeKeyPair();
	console.log(keys.pubKey)
	console.log(keys.privKey)

    // making one transaction
	const tx = gtx.newTransaction([]);
    // first parameter of addOperation is the name of the function, then all the input parameters
	tx.addOperation("insert_city", "Milan");
	await tx.postAndWaitConfirmation();
    
    
    const cities = await gtx.query('get_cities', {});
	console.log("Cities", cities);
})();
