const cloudinary = require('cloudinary');

cloudinary.v2.config({
  cloud_name: 'dijig9zmr',
  api_key: '529638533672255',
  api_secret: 'Op2ldGpc0lochipxMW2aAa3Pgn4',
  secure: true,
});

module.exports = cloudinary;