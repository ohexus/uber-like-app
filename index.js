const express = require('express');
const config = require("config");
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ extended: true }));

mongoose.connect('mongodb://localhost:27017/uber-like-app', { useNewUrlParser: true, useUnifiedTopology: true });

const User = require('./models/User');

const PORT = config.get('port') || 8081;

const log = require('./routes/middleware/log.middleware');
const auth = require('./routes/middleware/auth.middleware');

const authRouter = require('./routes/api/auth.routes');
const deleteUserRouter = require('./routes/api/deleteUser.routes');
const truckRouter = require('./routes/api/truck.routes');

app.use(log);

app.use('/api/auth', authRouter);

app.use(auth);

app.use('/api', deleteUserRouter);
app.use('/api/truck', truckRouter);

app.get('/api/users', (req, res) => {
    User.find({})
        .then(users => res.json({status: "ok", users}))
        .catch(e => res.status(500).json({status: e.message}));
});

app.get('/api/user', (req, res) => {
    User.findOne({ _id: req.user._id })
        .then(user => res.json(user))
        .catch(e => res.status(500).json({status: e.message}));
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
});