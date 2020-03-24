const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost:27017/uber-like-app', { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(8081, () => {
    console.log('server is running on port 8081')
});