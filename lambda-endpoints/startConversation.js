'use strict';

const AWS = require('aws-sdk');
const uuid = require ("uuid");
const { _200, _400, _500 } = require('../common/API_Response');
const DynamoDB = require('../common/DynamoDB');
const ConversationState = require('../common/ConversationState');
const SmsService = require('../common/SmsService');
const SystemMessages = require('../common/SystemMessages');

/*

*/
exports.handler = async (event, context, callback) => {
	
	console.log(`Received Event: ${JSON.stringify(event)}`);
	
	const {body: {card_id, name, phone_number, message}} = event;

	// Make sure phone_number is a string and strip all non-numbers
	const lightPhone = (phone_number+'').replace(/\D/g, '');
	if (lightPhone == '')
		return _400('Invalid phone number');
	if (lightPhone.length == 10)
		lightPhone = '1' + lightPhone;

	// Get the user so we can get make sure this is a valid card and get the user's phone number
	const userQueryResult = await DynamoDB.Query({
			TableName: 'user', 
			IndexName: 'cardIdIndex', 
			KeyConditionExpression: 'card_id = :card_id', 
			ExpressionAttributeValues: {':card_id': cardId}
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
	/*
	code to get numbers from twilio account
	const twilioNumbers = await twilioClient.incomingPhoneNumbers
        .list()
        .then(incomingPhoneNumbers => incomingPhoneNumbers.forEach(i => console.log(i.phoneNumber)));
	 */
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
		states: [ConversationState.UNACCEPTED],
		initial_message: message,
		light_user_name: name
	};
	const db = new AWS.DynamoDB.DocumentClient();
	const conversationSaveResult = await db.put({TableName: 'conversation', Item: conversation}).promise();
	console.log(`Conversation Save Result: ${JSON.stringify(conversationSaveResult)}`);

	const smsService = new SmsService();
	if (user.message_allowance > 0)
		await Promise.allSettled([
			smsService.send(user.phone_number, lightPhoneProxy, SystemMessages.StartConversation_Normal_CardUser(name, message)),
			smsService.send(phone_number, userPhoneProxy, SystemMessages.StartConversation_Normal_LightUser(user.firstName))
		]);
	else
		await Promise.allSettled([
			smsService.send(user.phone_number, lightPhoneProxy, SystemMessages.StartConversation_OutOfConversations_CardUser(name, message)),
			smsService.send(phone_number, userPhoneProxy, SystemMessages.StartConversation_OutOfConversations_LightUser(user.firstName))
		]);

	return _200('Success!!!');
};
