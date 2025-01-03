const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/health', (req, res) => {
    res.status(200).send('Healthy!');
  });

app.get('/', (req, res) => {
  const revisionName = process.env.K_REVISION;
  res.send(`Hello from revision: ${revisionName}`);
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
