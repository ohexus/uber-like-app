const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ extended: true }));

mongoose.connect(config.get('mongoUri'), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const PORT = config.get('port') || 8081;

const consoleLog = require('./api/middleware/consoleLog.middleware');
const requestLog = require('./api/middleware/requestLog.middleware');
const auth = require('./api/middleware/auth.middleware');

const clearDBRouter = require('./api/routes/clearDB.routes');
const allRequestLogsRouter = require('./api/routes/allRequestLogs.routes');
const authRouter = require('./api/routes/auth.routes');
const recoverPasswordRouter = require('./api/routes/recoverPassword.routes');
const userRouter = require('./api/routes/user.routes');
const truckRouter = require('./api/routes/truck.routes');
const loadRouter = require('./api/routes/load.routes');
const weatherRouter = require('./api/routes/weather.routes');

app.use(consoleLog);
app.use(requestLog);

app.use('/api/clearDB', clearDBRouter);
app.use('/api/allRequestLogs', allRequestLogsRouter);

app.use('/api/auth', authRouter);

app.use(auth);

app.use('/api/recoverPassword', recoverPasswordRouter);
app.use('/api/user', userRouter);
app.use('/api/truck', truckRouter);
app.use('/api/load', loadRouter);
app.use('/api/weather', weatherRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
