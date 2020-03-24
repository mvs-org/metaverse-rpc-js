const { MvsdJSONRPC } = require('..')

const mvsd = new MvsdJSONRPC()

mvsd.getHeight().subscribe((height) => {
    console.log(height)
})
