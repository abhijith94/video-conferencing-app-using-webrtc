const express = require('express');
const cors = require('cors');
const shortid = require('shortid');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$!',
);

app.get('/createRoom', (req, res) => {
  res.send({ success: true, data: shortid.generate() });
});

app.listen(3001, () => {
  console.log('server is running on port 3000');
});
