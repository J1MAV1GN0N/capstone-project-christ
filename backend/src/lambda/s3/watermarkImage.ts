import { SNSEvent, SNSHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import { createLogger } from '../../utils/logger';
import { getImage, updateUploadUrl, setProcessed } from '../../businessLayer/images'; // Diese drei direkt in Business Layer auslagern
import * as AWSXRay from 'aws-xray-sdk';
import * as Jimp from 'jimp';

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3()

const imagesBucketName = process.env.IMAGES_S3_BUCKET
const thumbnailBucketName = process.env.THUMBNAILS_S3_BUCKET

const logger = createLogger('image-watermark')

export const handler: SNSHandler = async (event: SNSEvent) => {
  console.log('Processing SNS event ', JSON.stringify(event))
  for (const snsRecord of event.Records) {
    const s3EventStr = snsRecord.Sns.Message
    console.log('Processing S3 event', s3EventStr)
    const s3Event = JSON.parse(s3EventStr)

    for (const record of s3Event.Records) {
      await processImage(record)
    }
  }
}

async function processImage(record) {
  const key = record.s3.object.key
  logger.info(`Processing S3 item with key: ${key}`)

  const response = await s3
      .getObject({
          Bucket: imagesBucketName,
          Key: key
      })
      .promise()

  const watermark = response.Metadata['watermark']

  const body = response.Body as Buffer
  const image = await Jimp.read(body)

  // Resizing image
  image.resize(512, Jimp.AUTO)

  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE)

  const maxWidth = image.getWidth() - 20 // image width - 10px margin left - 10px margin right
  const maxHeight = 15 + 20 // logo height + margin
  const placementX = 10 // 10px in on the x axis
  const placementY = image.getHeight() - (15 + 20) - 10 // bottom of the image: height - maxHeight - margin 
  logger.info(`Image watermark parameters\n maxWidth: ${maxWidth}, maxHeight: ${maxHeight}, ` + `placementX: ${placementX}, placementY: ${placementY}`)

  let textData = {
      text: watermark, // Rendered text on the processed image
      maxWidth: maxWidth,
      maxHeight: maxHeight,
      placementX: placementX,
      placementY: placementY
  };

  await image.print(font, textData.placementX, textData.placementY, {
      text: textData.text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
  }, textData.maxWidth, textData.maxHeight);

  // Convert the image type to jpeg
  const convertedBuffer = await image.getBufferAsync(Jimp.MIME_JPEG)

  logger.info(`Successfully watermarked image with key: ${key}`)
  // After processing image, uploading to second S3 Bucket
  await s3
      .putObject({
          Bucket: thumbnailBucketName,
          Key: `${key}.jpeg`,
          Body: convertedBuffer
      })
      .promise()

  logger.info(`Successfully uploaded thumbnail image with key: ${key}`)

  const imageItem = await getImage(key)

  await updateUploadUrl(imageItem.id, imageItem.userId, `https://${thumbnailBucketName}.s3.amazonaws.com/${key}.jpeg`)
  logger.info(`Successfully updated upload url in db with id: ${imageItem.id}`)

  await setProcessed(imageItem.id, imageItem.userId);
  logger.info(`Successfully set processed db image set processed success with id: ${imageItem.id}`)
}