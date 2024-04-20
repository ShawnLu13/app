'use strict';

var express = require('express');
var router = express.Router();

var hfc = require('fabric-client'); 
var path = require('path'); 
var sdkUtils = require('fabric-client/lib/utils') 
var fs = require('fs'); 
var options = { 
    user_id: 'Admin@org1.example.com', 
    msp_id:'Org1MSP', 
    channel_id: 'mychannel', 
    chaincode_id: 'usedcars', 
    network_url: 'grpcs://localhost:7051',//如果启用了TLS，就是grpcs，如果没有启用TLS，那么就是grpc 
    privateKeyFolder:'/home/liang/fabric-samples/first-network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore', 
    signedCert:'/home/liang/fabric-samples/first-network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem', 
    peer_tls_cacerts:'/home/liang/fabric-samples/first-network/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt', 
    server_hostname: "peer0.org1.example.com" 
};

router.post('/', function(req, res, next) {
    var channel = {}; 
    var client = null; 
    const getKeyFilesInDir = (dir) => { 
    //该函数用于找到keystore目录下的私钥文件的路径 
        var files = fs.readdirSync(dir) 
        var keyFiles = [] 
        files.forEach((file_name) => { 
            let filePath = path.join(dir, file_name) 
            if (file_name.endsWith('_sk')) { 
                keyFiles.push(filePath) 
            } 
        }) 
        return keyFiles 
    }
    Promise.resolve().then(() => {
        console.log("Load privateKey and signedCert");
        client = new hfc();
        var createUserOpt = {
            username: options.user_id,
            mspid: options.msp_id,
            cryptoContent: { privateKey: getKeyFilesInDir(options.privateKeyFolder)[0],
            signedCert: options.signedCert }
        }
        //以上代码指定了当前用户的私钥，证书等基本信息 
        return sdkUtils.newKeyValueStore({
            path: "/home/liang/fabric-client-stateStore/" 
        }).then((store) => {
            client.setStateStore(store) 
            return client.createUser(createUserOpt) 
        })
    }).then((user) => {
        channel = client.newChannel(options.channel_id);
        let data = fs.readFileSync(options.peer_tls_cacerts);
        let peer = client.newPeer(options.network_url,
            { 
                pem: Buffer.from(data).toString(), 
                'ssl-target-name-override': options.server_hostname 
            } 
        ); 
        peer.setName("peer0"); 
        //因为启用了TLS，所以上面的代码就是指定TLS的CA证书 
        channel.addPeer(peer);
        return;
    }).then(() => { 
        console.log("Make query"); 
        var transaction_id = client.newTransactionID(); 
        console.log("Assigning transaction_id: ", transaction_id._transaction_id); 
    //构造查询request参数 
        const request = { 
            chaincodeId: options.chaincode_id, 
            txId: transaction_id, 
            fcn: 'query', 
            args: [req.body['product-id']] 
        }; 
        return channel.queryByChaincode(request); 
    }).then((query_responses) => { 
        console.log("returned from query"); 
        if (!query_responses.length) { 
            console.log("No payloads were returned from query"); 
        } else { 
            console.log("Query result count = ", query_responses.length) 
        } 
        if (query_responses[0] instanceof Error) { 
            console.error("error from query = ", query_responses[0]); 
        } 
        console.log("Response is ", query_responses[0].toString());//打印返回的结果
        return query_responses[0].toString();
    }).then((data) => {
      var data_list = data.split('&');
      var temp_data = {
        'Product': data_list[0],
        'Product Type': data_list[1],
        'Product Description': data_list[2],
        'Production Time': data_list[3],
        'Manufacturer': data_list[4],
        'Manufacturer Address': data_list[5],
        'Sales Time': data_list[6],
        'Sales Location': data_list[7],
        'Sales Price': data_list[8],
        'Start Address': data_list[9],
        'Time 1': data_list[10],
        'Address 2': data_list[11],
        'Time 2': data_list[12],
        'Last Address': data_list[13],
        'Time 3': data_list[14],
      }
      return temp_data;
    }).then((temp_data) => {
      res.render('query', temp_data);
    }).catch((err) => { 
        console.error("Caught Error", err); 
    });
});

module.exports = router;