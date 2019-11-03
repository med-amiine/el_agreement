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
	const keys_user = pcl.util.makeKeyPair();
	console.log(keys_user.pubKey)
    console.log(keys_user.privKey)

    const keys_investor = pcl.util.makeKeyPair();
	console.log(keys_investor.pubKey)
	console.log(keys_investor.privKey)

    const keys_smart_contract = Buffer.from("smart contract"+Date.now());
    
    // function operation_call(tx,key,operation,args,){
    //     //  making one transaction
    //     const tx = gtx.newTransaction([key]);
    //     // first parameter of addOperation is the name of the function, then all the input parameters
    //     tx.addOperation(operation, key.pubKey, args[0]);
    //     tx.sign(key.privKey, key.pubKey)
    //     await tx.postAndWaitConfirmation();
    // }

    // making one transaction
	const tx = gtx.newTransaction([keys_user.pubKey]);
    // first parameter of addOperation is the name of the function, then all the input parameters
    tx.addOperation("register_user", keys_user.pubKey, "Mohammed");
    tx.sign(keys_user.privKey, keys_user.pubKey)
    await tx.postAndWaitConfirmation();

    // const user_args = ['Mohammed', undefined, undefined,undefined,undefined];
    // operation_call("tx",keys_user,"register_user",user_args)
    console.log("Entrepreneur",await gtx.query("get_user",{user_pubkey: keys_user.pubKey.toString('hex')}))

    const tx2 = gtx.newTransaction([keys_investor.pubKey]);
    tx2.addOperation("register_investor", keys_investor.pubKey, "Sage intacct", 8500000,50000);
    tx2.sign(keys_investor.privKey, keys_investor.pubKey);
	await tx2.postAndWaitConfirmation();
    
    const tx_balance = gtx.newTransaction([keys_user.pubKey]);
    tx_balance.addOperation("insert_balance", keys_user.pubKey, "Momo", 4500,0,0,0);
    tx_balance.sign(keys_user.privKey, keys_user.pubKey);
	await tx_balance.postAndWaitConfirmation();
    console.log("the statup balance",await gtx.query("get_balance",{startup_pubkey: keys_user.pubKey.toString('hex')}))

    const tx_smart_contract = gtx.newTransaction([keys_user.pubKey]);
    tx_smart_contract.addOperation("create_contract", keys_user.pubKey,keys_investor.pubKey, keys_smart_contract, "funding contract for startuo momo");
    tx_smart_contract.sign(keys_user.privKey, keys_user.pubKey);
	await tx_smart_contract.postAndWaitConfirmation();
    console.log("the smart contract information",await gtx.query("get_smart_contract",{smart_contract_pubkey: keys_smart_contract.toString('hex')}))

    const tx_rules = gtx.newTransaction([keys_investor.pubKey]);
    tx_rules.addOperation("insert_rules", keys_smart_contract, 6000,10000,10);
    tx_rules.sign(keys_investor.privKey, keys_investor.pubKey);
	await tx_rules.postAndWaitConfirmation();
    console.log("the smart contract rules",await gtx.query("get_rules",{smart_contract_pubkey: keys_smart_contract.toString('hex')}))



})();
