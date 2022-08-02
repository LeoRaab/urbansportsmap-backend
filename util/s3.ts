import * as S3 from 'aws-sdk/clients/s3';
import * as fs from 'fs';
import * as uuid from 'uuid';

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
});

export const uploadFile = (buffer: Buffer): Promise<S3.ManagedUpload.SendData> => {
    const uploadParams = {
        Bucket: bucketName!,
        Body: buffer,
        Key: uuid.v4()
    }

    return s3.upload(uploadParams).promise();
}

export const getFileStream = (fileKey: string) => {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName!
    }

    return s3.getObject(downloadParams).createReadStream();
}

export const deleteFile = (fileKey: string) => {
    const deleteParams = {
        Key: fileKey,
        Bucket: bucketName!
    }

    return s3.deleteObject(deleteParams).promise();
}