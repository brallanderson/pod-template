const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
process.env.NODE_ENV === 'production';
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

//require('./services/email');

mongoose.connect(process.env.MONGO_URI);

console.log(process.env.MONGO_URI);

const app = express();
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
router(app);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
