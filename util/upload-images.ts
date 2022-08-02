import { uploadFile } from './s3';
import resizeImage from './resize-image';

export interface UploadImage {
  key: string;
  url: string;
}

const uploadImages = async (images: Express.Multer.File[]): Promise<{ uploadedImages: UploadImage[] }> => {
  const resizedImages: Buffer[] = [];
  const uploadedImages: UploadImage[] = [];

  for (const image of images) {
    const resizedImage = await resizeImage(image);

    if (resizedImage) {
      const { Key, Location } = await uploadFile(resizedImage);
      uploadedImages.push({ key: Key, url: Location });
    }
  }

  return { uploadedImages };
};

export default uploadImages;
