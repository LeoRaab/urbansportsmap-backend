import sharp = require('sharp');

const resizeImage = async (image: Express.Multer.File): Promise<Buffer | undefined> => {
  try {
    return await sharp(image.buffer)
      .resize(1600, 1200, {
        kernel: sharp.kernel.nearest,
        fit: 'cover'
      })
      .jpeg()
      .toBuffer();
  } catch (e) {
    //Log error!
  }
};

export default resizeImage;
