const express = require('express');
const shortid = require('shortid');
const cors = require('cors');
const { PeerServer } = require('peer');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ()'
);

app.get('/createMeetUrl', (req, res) => {
  res.send({ success: true, data: shortid.generate() });
});

app.listen(3001, () => {
  console.log('server is running on port 3001');
  require('./socket');
  const peerServer = PeerServer({ port: 9000, path: '/myapp' });
});
