const express = require('express');
const helmet = require("helmet");

const server = express();

function logger(req, res, next) {
    console.log(`a ${reqmethod} to ${req.path} at ${Date.now()}`);
    next();
}

server.use(express.json());
server.use(helmet());
server.use(logger);

server.get('/', (req, res) => {
  res.send('testing')
});

const port = 5000;

server.listen(port, () => console.log('\nserver running\n'));
