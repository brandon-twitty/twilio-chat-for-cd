const AWS = require('aws-sdk');
const dynamoDocClient = new AWS.DynamoDB.DocumentClient();

exports.Query = async (queryParams, logPrefix) => {

	/*
	const queryParams = {
		TableName: ..., 
		IndexName: ..., 
		KeyConditionExpression: ..., 
		ExpressionAttributeValues: { ... }
	};
	*/

	if (logPrefix != null)
		console.log(`${logPrefix}: ${JSON.stringify(queryParams)}`);

	const queryResult = await dynamoDocClient.query(queryParams).promise();

	if (logPrefix != null)
		console.log(`${logPrefix} Result: ${JSON.stringify(queryResult)}`);
	
	return queryResult;
};