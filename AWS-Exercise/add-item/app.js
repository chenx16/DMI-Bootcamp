// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
const AWS = require('aws-sdk');
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
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing body' }),
      };
    }
    const body = JSON.parse(event.body);
    if (!body.id || !body.message) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing `id` or `message` body property',
        }),
      };
    }
    dynamoDbClient = dynamoDbClient || new AWS.DynamoDB.DocumentClient();
    const result = await dynamoDbClient
    .put({
      TableName: process.env.TABLE_NAME,
      Item: {
        id: body.id,
        message: body.message,
      },
    })
    .promise();
  return { statusCode: 201, body: JSON.stringify(result) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

