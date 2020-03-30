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
const userRouter = require('./routes/api/user.routes');
const truckRouter = require('./routes/api/truck.routes');
const loadRouter = require('./routes/api/load.routes');

app.use(log);

app.use('/api/auth', authRouter);

app.use(auth);

app.use('/api/user', userRouter);
app.use('/api/truck', truckRouter);
app.use('/api/load', loadRouter);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
});