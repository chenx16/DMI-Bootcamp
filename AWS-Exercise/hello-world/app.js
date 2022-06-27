// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
const AWS = require('aws-sdk');
let response;
let dynamoDbClient;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context) => {
    try {
        dynamoDbClient = dynamoDbClient || new AWS.DynamoDB.DocumentClient();
        // const ret = await axios(url);
        response = {
            statusCode: 200,
            body: JSON.stringify(
              await dynamoDbClient
                .scan({
                  TableName: process.env.TABLE_NAME,
                })
                .promise()
            ),
          };
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
