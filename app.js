const express = require('express');
const app = express();
const PORT = 3000;

app.get('/',function(req,res) {
  res.send("Hello TechShot");
});

app.listen(PORT);

console.log(`Listening to port ${PORT}`);
