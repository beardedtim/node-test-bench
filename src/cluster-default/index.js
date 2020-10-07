const cluster = require('cluster')
const os = require('os')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const env = require('getenv')

const numCPUs = os.cpus().length

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    

    const app = express()

    app
        .use(bodyParser.json())
        .use(cors())
        .use(helmet())
        // .use(morgan('combined'))

    app.get('/', (req, res) => {
        res.status(200).json({
            data: true,
            pid: process.pid
        })
    }).post('/', (req, res) => {
        res.status(201).json({ data: req.body, pid: process.pid })
    })

    const PORT = env.int('PORT', 5050)

    app.listen(PORT, () => console.log('I started at %s', PORT))
}