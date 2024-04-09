const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'dgx0cufg6', 
  api_key: '638949256375727', 
  api_secret: '23moEvntEoaMN7s_pDcnSIJJY38' 
});

module.exports = cloudinary;
