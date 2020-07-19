'use strict';

const AWS = require('aws-sdk');
const uuid = require ("uuid");
const { _200, _400, _500 } = require('../common/API_Response');
const DynamoDB = require('../common/DynamoDB');
const ConversationState = require('../common/ConversationState');
/*

*/
exports.handler = async (event, context, callback) => {
	
	console.log(`Received Event: ${JSON.stringify(event)}`);
	
	const {body: {card_id, name, phone_number, message}} = event;

	// Make sure phone_number is a string and strip all non-numbers, prefixing with country code 1 as a default
	let lightPhone = (phone_number+'').replace(/\D/g, '');
	if (lightPhone == '' || lightPhone.length < 10)
		return _400('Invalid phone number');
	if (lightPhone.length == 10)
		lightPhone = '1' + lightPhone;
	
	// Get the user so we can get make sure this is a valid card and get the user's phone number
	const userQueryResult = await DynamoDB.Query({
			TableName: 'user', 
			IndexName: 'cardIdIndex', 
			KeyConditionExpression: 'card_id = :card_id', 
			ExpressionAttributeValues: {':card_id': card_id}
		}, 
		'Query User');
	if (userQueryResult.Items.length < 1)
		return _400("Card not found");
	const user = userQueryResult.Items[0];

	// Set up the light user
	// ...

	// Prevent same-number conversations
	if (user.phone_number == lightPhone)
		return _400("Can't converse with yourself");

	// temporary hard coded list of numbers until this becomes more dynamic
	const available_numbers = ['13143104002', '13143754245', '13143103033'];
	
	// Given an array of phone numbers in use, return the first available number from the list above that isn't already used - or null if all are
	const proxyNumberResolver = inUseNumbers => (choices => choices.length > 0 ? choices[0] : null)(available_numbers.filter(availableNumber => !inUseNumbers.includes(availableNumber)));
	
	// Get proxy numbers the user is already interacting with in other conversations so they aren't double-assigned
	const userConvQueryResult = await DynamoDB.Query({
			TableName: 'conversation', 
			IndexName: 'UserPhoneIndex', 
			KeyConditionExpression: 'user_phone = :user_phone',
			ExpressionAttributeValues: {':user_phone': user.phone_number} 
		}, 
		'User Conversation Query');
	const lightPhoneProxy = proxyNumberResolver(userConvQueryResult.Items.map(c => c.light_phone_proxy));
	console.log(`Chose LightUser Proxy Number: ${lightPhoneProxy}`);
	if (lightPhoneProxy == null)
		return _500('No available proxy phone numbers for light user');

	// Get the proxy numbers the lightuser is already interacting with in other conversations so they aren't double-assigned
	const lightConvQueryResult = await DynamoDB.Query({
			TableName: 'conversation', 
			IndexName: 'LightPhoneIndex', 
			KeyConditionExpression: 'light_phone = :light_phone',
			ExpressionAttributeValues: {':light_phone': lightPhone} 
		}, 
		'LightUser Conversation Query');
	const userPhoneProxy = proxyNumberResolver(lightConvQueryResult.Items.map(c => c.user_phone_proxy));
	console.log(`Chose User Proxy Number: ${userPhoneProxy}`);
	if (userPhoneProxy == null)
		return _500('No available proxy phone numbers for user');
	
	// Create and store the conversation
	const conversation = {
		ID: uuid.v1(),
		user_phone: user.phone_number,
		user_phone_proxy: userPhoneProxy,
		light_phone: lightPhone,
		light_phone_proxy: lightPhoneProxy,
		states: [ConversationState.UNACCEPTED]
	};
	const db = new AWS.DynamoDB.DocumentClient();
	const conversationSaveResult = await db.put({TableName: 'conversation', Item: conversation}).promise();
	console.log(`Conversation Save Result: ${JSON.stringify(conversationSaveResult)}`);

	return _200('Success!!!');
};