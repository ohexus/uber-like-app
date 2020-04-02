const router = require('express').Router();
const axios = require('axios');
const config = require('config');

// api/weather/
router.post('/', async (req, res) => {
    try {
        const { lat, lon } = req.body;

        const openWeatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.get('openWeatherAPIkey')}&units=metric`;

        const weatherResponse = await axios.get(openWeatherUrl);

        res.status(200).json(weatherResponse.data);

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

module.exports = router;