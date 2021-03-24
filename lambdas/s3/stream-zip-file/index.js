const AWS = require("aws-sdk");
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
const unzipper = require("unzipper");

exports.handler = async (event) => {

  //...initialize bucket, filename and target_filename here
  try {
    /**
     * Step 1: Get stream of the file to be extracted from the zip
     */
    const file_stream = s3
      .getObject({ Bucket: bucket, Key: filename })
      .createReadStream()
      .on("error", (e) => console.log(`Error extracting file: `, e))
      .pipe(
        unzipper.ParseOne("file_name_inside_zip.ext", {
          forceStream: true,
        })
      );

    /**
     * Step 2: upload extracted stream back to S3: this method supports a readable stream in the Body param as per
     *  https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
     */
    await s3
      .upload({ Bucket: bucket, Key: target_filename, Body: file_stream })
      .promise();

  } catch (error) {
    console.log("Error: ", error.message, error.stack);
  }

};

