const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send({ success: true });
});

app.listen(3000, () => {
  console.log('server is running on port 3000');
});
