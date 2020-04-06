const router = require('express').Router();

const RequestLog = require('../../models/RequestLog');

// api/allRequestLogs/
router.get('/api/allRequestLogs', async (req, res) => {
    try {
        const logs = await RequestLog.find({});

        res.status(200).send(logs);

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

module.exports = router;