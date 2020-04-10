/* eslint indent: ["error", 2, { "SwitchCase": 1 }] */
module.exports = (prev) => {
  switch (prev) {
    case 'En route to Pick Up':
      return 'Arrived to Pick Up';

    case 'Arrived to Pick Up':
      return 'En route to Delivery';

    case 'En route to Delivery':
      return 'Arrived to Delivery';

    case 'Arrived to Delivery':
      return 'Close Order';

    default:
      return 'En route to Pick Up';
  };
};
