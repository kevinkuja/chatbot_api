import express from 'express';
import { decodeHandler } from './handlers/index.js';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.post('/api/v1/decode', decodeHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
