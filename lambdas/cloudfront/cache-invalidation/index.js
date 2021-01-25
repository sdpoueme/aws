const AWS = require('aws-sdk');
const cloudfront = new AWS.CloudFront({ apiVersion: '2020-05-31' });
const codepipeline = new AWS.CodePipeline();

exports.handler = async(event) => {
    console.log('event', JSON.stringify(event));
    const job = event["CodePipeline.job"];
    const jobId = job.id;

    const DistributionId = job.data.actionConfiguration.configuration.UserParameters || '<PLACEHOLDER: DISTRIBUTION ID>';

    console.log(`invalidating CDN cache for DistributionId : ${DistributionId}...`);

    const CallerReference = Date.now().toString();

    try {
        const params = {
            DistributionId,
            InvalidationBatch: {
                CallerReference,
                Paths: {
                    Quantity: 1,
                    Items: [
                        '/*',
                    ]
                }
            }
        };

        console.log('cloudfront.createInvalidation', params);

        const body = await cloudfront.createInvalidation(params).promise();

        console.log('cloudfront.createInvalidation body', body);

        await codepipeline.putJobSuccessResult({ jobId }).promise();

        // successful response
        const response = {
            statusCode: 200,
            body
        };
        return response;


    }
    catch (err) {
        console.log('err', JSON.stringify(err));
        const params = {
            jobId: jobId,
            failureDetails: {
                message: JSON.stringify(err),
                type: 'JobFailed'
                //externalExecutionId: context.awsRequestId
            }
        };
        await codepipeline.putJobFailureResult(params).promise();
        const response = {
            statusCode: 500,
            body: err.stack
        };
        return response;
    }


};
