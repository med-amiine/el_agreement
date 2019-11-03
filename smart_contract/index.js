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
    const keys_investor = pcl.util.makeKeyPair();
    const keys_bank = pcl.util.makeKeyPair();

    const smart_contract_id = Buffer.from("smart contract"+Date.now());
    
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

    const tx01 = gtx.newTransaction([keys_bank.pubKey]);
    // first parameter of addOperation is the name of the function, then all the input parameters
    tx01.addOperation("register_bank", keys_bank.pubKey, "American Bank");
    tx01.sign(keys_bank.privKey, keys_bank.pubKey)
    await tx01.postAndWaitConfirmation();

    // const user_args = ['Mohammed', undefined, undefined,undefined,undefined];
    // operation_call("tx",keys_user,"register_user",user_args)
    console.log("Entrepreneur",await gtx.query("get_user",{user_pubkey: keys_user.pubKey.toString('hex')}))

    const tx2 = gtx.newTransaction([keys_investor.pubKey]);
    tx2.addOperation("register_investor", keys_investor.pubKey, "Sage intacct", 8500000,50000);
    tx2.sign(keys_investor.privKey, keys_investor.pubKey);
	await tx2.postAndWaitConfirmation();
    
    const tx_smart_contract = gtx.newTransaction([keys_user.pubKey]);
    tx_smart_contract.addOperation("create_contract", keys_user.pubKey,keys_investor.pubKey, smart_contract_id, "funding contract for startuo momo");
    tx_smart_contract.sign(keys_user.privKey, keys_user.pubKey);
	await tx_smart_contract.postAndWaitConfirmation();
    contract_info = ("the smart contract information",await gtx.query("get_smart_contract",{smart_contract_pubkey: smart_contract_id.toString('hex')}));
    console.log(contract_info);  

    const tx3 = gtx.newTransaction([keys_investor.pubKey]);
    tx3.addOperation("insert_rules", 
        keys_investor.pubKey, 
        smart_contract_id,
        8500000,
        5000000,
        345,
        2222,
        333,
        2134,
        100000
    );
    tx3.sign(keys_investor.privKey, keys_investor.pubKey);
    await tx3.postAndWaitConfirmation();
    // QUERY HERE


    const tx4 = gtx.newTransaction([keys_investor.pubKey]);
    tx4.addOperation("deposit", 
        keys_investor.pubKey, 
        smart_contract_id,
        "Sage intacct", 
        8500000,
        5000000,
        345,
        2222,
        333,
        2134,
        0
    );
    tx4.sign(keys_investor.privKey, keys_investor.pubKey);
    await tx4.postAndWaitConfirmation();
    // QUERY HERE

    
    const tx5 = gtx.newTransaction([keys_bank.pubKey]);
    tx5.addOperation("transfer", keys_bank.pubKey, smart_contract_id, 9, "marketing");
    tx5.sign(keys_bank.privKey, keys_bank.pubKey);
    await tx5.postAndWaitConfirmation();
    console.log(await gtx.query("get_marketing_amount", {scid: smart_contract_id.toString('hex')}));
    // const tx_rules = gtx.newTransaction([keys_investor.pubKey]);
    // tx_rules.addOperation("insert_rules", keys_smart_contract, 6000,10000,10);
    // tx_rules.sign(keys_investor.privKey, keys_investor.pubKey);
	// await tx_rules.postAndWaitConfirmation();
    // console.log("the smart contract rules",await gtx.query("get_rules",{smart_contract_pubkey: keys_smart_contract.toString('hex')}));

    // const tx_status = gtx.newTransaction([keys_investor.pubKey]);
    // tx_status.addOperation("init_status", keys_smart_contract, 0,0,0);
    // tx_status.sign(keys_investor.privKey, keys_investor.pubKey);
	// await tx_status.postAndWaitConfirmation();
    // console.log("the smart contract status",await gtx.query("get_status",{smart_contract_pubkey: keys_smart_contract.toString('hex')}));

    // const tx_update_status = gtx.newTransaction([keys_user.pubKey]);
    // tx_update_status.addOperation("update_status",keys_smart_contract);
    // tx_update_status.sign(keys_user.privKey, keys_user.pubKey);
	// await tx_update_status.postAndWaitConfirmation();
    // console.log("the smart contract status after update",await gtx.query("get_status",{smart_contract_pubkey: keys_smart_contract.toString('hex')}));

})();
