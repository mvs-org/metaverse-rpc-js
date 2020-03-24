<p align="center">
  <a href="https://mvs.org/">
    <img width="200" src="https://raw.githubusercontent.com/mvs-org/lightwallet/master/src/assets/logo.png" alt="">
  </a>
  <br>
  <br>
  JavaScript library for the Metaverse Blockchain Websocket and JSON-RPC services
</p>

# Metaverse Websocket and JSONRPC

## Setup

```
npm i mvsd
```

## JSON-RPC

Initialize the connection settings
```
const { MvsdJSONRPC } = require('mvsd')
const mvsd = new MvsdJSONRPC('http://127.0.0.1:8820/rpc/v3')
```

Get the current height of the blockchain
```
mvsd.getHeight().subscribe(console.log)
```

Get a block by its number or txid
```
mvsd.getBlock({number: 100})
    .subscribe(console.log)
// or by txid
mvsd.getBlock({txid: 'b81848ef9ae86e84c3da26564bc6ab3a79efc628239d11471ab5cd25c0684c2d'})
    .subscribe(console.log)
```

Send new encoded raw transaction
```
mvsd.sendrawtx({tx: '020000000131fb2354bb0dd453cb8a9810d6275ca733841d9cea3c152007d58172adec23da000000006a47304402204afef05015629fffb91081e7fc90518b3e54922eea7a8027723e82fb2cb096080220527664f493c5174c78e66f8671f8aabee0786c157fb56e840af984e78aa6c5ac012103de1770dd27b09872a29047eac2f16e159647dd96c00c869dbc2eb77f5489799fffffffff0200000000000000001976a914ac3277a9c4981f4f08a7cdcf1014bbfb7d41ee7588ac010000000200000001000000074d56532e48554700c63e0500000000000000000d4d56532e584d41532e5445414d224d50626575787259794a535473424c4a4e69344d365a51617875476f7a317841507a2461206875672061206461792c206b65657020796f752063686565727320616c6c2064617920d74469000000001976a914ac3277a9c4981f4f08a7cdcf1014bbfb7d41ee7588ac010000000000000000000000'})
    .subscribe(console.log)
```

### other functions
tx-decode
validate-tx
getnewaccount
getaccount
deleteaccount
importaccount
changepasswd
getnewaddress
validateaddress
listaddresses
dumpkeyfile
importkeyfile
importaddress
shutdown
getinfo
addnode
getpeerinfo
getrandom
verifyrandom
startmining
stopmining
getmininginfo
getstakeinfo
setminingaccount
getwork
submitwork
getmemorypool
registerwitness
getblockheader
fetchheaderext
gettx
listtxs
popblock
createrawtx
decoderawtx
signrawtx
getpublickey
createmultisigtx
getnewmultisig
listmultisig
deletemultisig
signmultisigtx
send
sendmore
sendfrom
lock
listbalances
getbalance
getaddressetp
getlocked
validatesymbol
createasset
deletelocalasset
issue
secondaryissue
sendasset
sendmoreasset
sendassetfrom
listassets
getasset
getaccountasset
getaddressasset
burn
swaptoken
issuecert
transfercert
registermit
transfermit
listmits
getmit
registerdid
didchangeaddress
listdids
getdid


## Websocket

Initialize the connection (NodeJS)
```
const { MvsdWebsocket } = require('mvsd')
const websocket = new MvsdWebsocket('ws://127.0.0.1:8821/ws')
```

Initialize the connection (Browser)
```
<script src="./dist/mvsd.browser.js"></script>
<script>
    const websocket = new Mvsd.MvsdWebsocket('ws://127.0.0.1:8821/ws')
</script>
```

Connect to server
```
websocket.connect()
```

Check for status
```
mvsd.ready.subscribe(ready => {
    if(ready){
        return console.log('websocket ready')
    }
    console.log('websocket not ready')
})
```

Subscribe to transactions
```
mvsd.subscribeTransactions()
// or
mvsd.subscribeTransactions(['YOUR_ADDRESS_1', 'YOUR_ADDRESS_2])
```

Subscribe to blocks
```
mvsd.subscribeBlocks()
```

Process incomming transactions
```
mvsd.transactions.subscribe((tx) => {
    if (tx.height > 0) {
        console.log('tx confirmed', tx.hash)
    } else {
        console.log('received unconfirmed tx', tx.hash)
    }
})
```

Process incomming blocks
```
mvsd.blocks.subscribe((block) => console.log('received block', block.hash))
```

