import configData from 'config/config';

const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: configData.cloudniary.cloudName,
  api_key: configData.cloudniary.apiKey,
  api_secret: configData.cloudniary.apiSecret,
});

const uploadToCloudinary = async (displayPicture, imageList, args) => {
  try {
    if (imageList.length) {
      imageList.map(async (i) => {
        const photoOnCloudinary = await cloudinary.uploader.upload(`temp_images/${i}`, {
          use_filename: true,
          folder: `dryp-shoe-pictures/${args.slug}`,
          unique_filename: false,
        });
        if (!photoOnCloudinary.asset_id) {
          imageList.splice(imageList.indexOf(i), 1);
        }
      });
      args.imageList = imageList;
    }
    if (displayPicture) {
      const thumbnailImage = await cloudinary.uploader.upload(`temp_images/${displayPicture}`, {
        use_filename: true,
        folder: `dryp-shoe-pictures/${args.slug}`,
        unique_filename: false,
        invalidate: true,
      });
      if (thumbnailImage.asset_id) {
        args.mainPictureUrl = displayPicture;
      }
    }
    return { data: args, error: false };
  } catch (e) {
    throw new Error(`error from uploadToCloudinary : ${e.message}`);
  }
};
module.exports = uploadToCloudinary;
