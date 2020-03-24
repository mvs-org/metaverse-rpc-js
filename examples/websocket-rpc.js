const { MvsdWebsocketRPC } = require('..')

const mvsd = new MvsdWebsocketRPC()

mvsd.connect()

mvsd.ready.subscribe(() => {
    mvsd.getBlock({ number: 2 }).subscribe((info) => {
        console.log(JSON.stringify(info, null, 2))
        mvsd.disconnect()
    })
})