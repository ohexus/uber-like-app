const router = require('express').Router();
const axios = require('axios');
const config = require('config');

const Weather = require('../../models/Weather');

// Weather Schema
// created_by: {type: Types.ObjectId, ref: 'User'}
// weather: {
//     main: {type: String, default: ''},
//     description: {type: String, default: ''},
//     icon: {type: String, default: ''}
// },
// main: {                                                     
//     temp: {type: Number, default: 0},                                                                 
//     feels_like: {type: Number, default: 0},   
//     pressure: {type: Number, default: 0},
//     humidity: {type: Number, default: 0}
// },
// wind: {
//     speed: {type: Number, default: 0},
//     deg: {type: Number, default: 0}
// }

// api/weather/update
router.post('/update', async (req, res) => {
    try {
        const { lat, lon } = req.body;

        const openWeatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.get('openWeatherAPIkey')}&units=metric`;

        const weatherResponse = await axios.get(openWeatherUrl).then(res => res.data);

        const weather = await Weather.findOneAndUpdate({
            created_by: req.user._id
        }, {
            weather: {
                main: weatherResponse.weather[0].main,
                description: weatherResponse.weather[0].description,
                icon: weatherResponse.weather[0].icon
            },
            main: {                                                     
                temp: weatherResponse.main.temp,                                                                 
                feels_like: weatherResponse.main.feels_like,   
                pressure: weatherResponse.main.pressure,
                humidity: weatherResponse.main.humidity
            },
            wind: {
                speed: weatherResponse.wind.speed,
                deg: weatherResponse.wind.deg
            }
        }, {new: true});

        res.status(200).send(weather);

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/weather/deleteall
router.delete('/deleteAll', async (req, res) => {
    try {
        await Weather.deleteMany({}, (e) => {
            if (e) return handleError(e);
        });

        res.status(200).json({ status: 'successful deletion' });

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/weather/all
router.get('/all', async (req, res) => {
    try {
        const weather = await Weather.find({});

        res.status(200).send(weather);

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

module.exports = router;