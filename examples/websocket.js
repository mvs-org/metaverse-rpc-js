const { MvsdWebsocket } = require('..')

const mvsd = new MvsdWebsocket()

mvsd.connect()

mvsd.ready.subscribe(ready => {
    if (ready) {
        mvsd.channels.subscribe((channels) => {
            console.log('subscribed to channels', channels)
            if (channels.indexOf('tx') === -1) {
                mvsd.subscribeTransactions()
            }
            if (channels.indexOf('block') === -1) {
                mvsd.subscribeBlocks()
            }
        })
    }
})

mvsd.transactions.subscribe((tx) => {
    if (tx.height > 0) {
        console.log('tx confirmed', tx.hash)
    } else {
        console.log('received unconfirmed tx', tx.hash)
    }
})
mvsd.blocks.subscribe((block) => console.log('received block', block.hash))
