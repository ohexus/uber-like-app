const truckTypes = require('../config/truckTypes');

// {
//     "sprinter": {
//         "length": 300,
//         "width": 250,
//         "height": 170,
//         "payload": 1700
//     },
//     "smallStraight": {
//         "length": 500,
//         "width": 250,
//         "height": 170,
//         "payload": 2500
//     },
//     "largeStraight": {
//         "length": 700,
//         "width": 350,
//         "height": 200,
//         "payload": 4000
//     }
// }

// load example
// length 200
// width 200
// height 100
// payload 1000

module.exports = (size, payload) => {
    if (
        size.length <= truckTypes.sprinter.length
        && size.width <= truckTypes.sprinter.width
        && size.height <= truckTypes.sprinter.height
        && payload <= truckTypes.sprinter.payload
    ) {
        return 'sprinter'
    }
    if (
        size.length <= truckTypes.smallStraight.length
        && size.width <= truckTypes.smallStraight.width
        && size.height <= truckTypes.smallStraight.height
        && payload <= truckTypes.smallStraight.payload
    ) {
        return 'smallStraight'
    }
    if (
        size.length <= truckTypes.largeStraight.length
        && size.width <= truckTypes.largeStraight.width
        && size.height <= truckTypes.largeStraight.height
        && payload <= truckTypes.largeStraight.payload
    ) {
        return 'largeStraight'
    }
    
    return null
};