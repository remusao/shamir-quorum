import express from 'express';
import bodyParser from 'body-parser';
import { combine, hex2str, init } from './vendor/secrets';

const app = express();
app.use(bodyParser.json());

init(20);
const values = new Map();

app.post('/collect', (req, res) => {
  const { h, s } = req.body;
  if (!values.has(h)) {
    console.log('New value', h);
    values.set(h, new Set());
  }
  values.get(h).add(s);

  if (values.get(h).size === 3) {
    console.log('Combine', h, hex2str(combine([...values.get(h)])));
    values.delete(h);
  }

  res.send('OK');
});

app.listen(3000);
