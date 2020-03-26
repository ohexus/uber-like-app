const express = require('express');
const config = require("config");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost:27017/uber-like-app', { useNewUrlParser: true, useUnifiedTopology: true });

const User = require('./models/User');

const PORT = config.get('port') || 8081;

const log = require('./routes/middleware/log');
const auth = require('./routes/middleware/auth');

const loginRouter = require('./routes/api/login');
const logoutRouter = require('./routes/api/logout');
const signupRouter = require('./routes/api/signup');
const deleteUserRouter = require('./routes/api/deleteUser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
app.use(cookieParser());

app.use(log);

app.use('/api', signupRouter);
app.use('/api', loginRouter);

app.use(auth);

app.use('/api', logoutRouter);
app.use('/api', deleteUserRouter);

app.get('/api/users', (req, res) => {
    User.find({})
        .then(users => res.json({status: "ok", users}))
        .catch(e => res.status(500).json({status: e.message}));
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
});