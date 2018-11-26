const fetch = require('node-fetch');
const sharify = require('./dist/client.umd');

const value = process.argv[process.argv.length - 1];
fetch('http://localhost:3000/collect', {
  method: 'post',
  body: JSON.stringify(sharify(value)),
  headers: { 'Content-Type': 'application/json' },
}).then(() => console.log('Done'));
