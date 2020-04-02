const express = require('express');
const config = require("config");
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const RequestLog = require('./models/RequestLog');

app.use(cors());
app.use(express.json({ extended: true }));

mongoose.connect(config.get('mongoUri'), { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const PORT = config.get('port') || 8081;

const auth = require('./routes/middleware/auth.middleware');
const consoleLog = require('./routes/middleware/consoleLog.middleware');
const requestLog = require('./routes/middleware/requestLog.middleware');

const authRouter = require('./routes/api/auth.routes');
const userRouter = require('./routes/api/user.routes');
const truckRouter = require('./routes/api/truck.routes');
const loadRouter = require('./routes/api/load.routes');
const weatherRouter = require('./routes/api/weather.routes');
const clearDBRouter = require('./routes/api/clearDB.routes');

app.use(consoleLog);
app.use(requestLog);

app.use('/api/clearDB', clearDBRouter);
app.use('/api/auth', authRouter);

app.use(auth);

app.use('/api/user', userRouter);
app.use('/api/truck', truckRouter);
app.use('/api/load', loadRouter);
app.use('/api/weather', weatherRouter);

app.get('/api/allRequestLogs', async (req, res) => {
    try {
        const logs = await RequestLog.find({});

        res.status(200).send(logs);

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
});