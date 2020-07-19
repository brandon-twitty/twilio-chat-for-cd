'use strict';
const Responses = require('../common/API_Response');
const DynamoDB = require('../common/DynamoDB');
const ConversationState = require('../common/ConversationState');
const AWS = require('aws-sdk');
const uuid = require ("uuid");
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(twilioAccountSid, twilioAuthToken);
const { _200, _400 } = require('../common/API_Response');

async function getConversationAndSendMessage(conversations, originPhone, isUser, messageContent)
{
	const conversation = conversations.filter(c => originPhone == (isUser ? c.user_phone : c.light_phone))[0];
	if (conversation == null)
		return _400('No such conversation exists');

	if (conversation.states.includes(ConversationState.UNACCEPTED))
		return _400('The user has not accepted this conversation');

	const twMessage = {
		from: (isUser ? conversation.user_phone_proxy : conversation.light_phone_proxy), 
		to: (isUser ? conversation.light_phone : conversation.user_phone), 
		body: messageContent
	};
	console.log(`Sending message: ${JSON.stringify(twMessage)}`);
	const twMessageInstance = await twilioClient.messages.create(twMessage);
	console.log(`Twilio Response: ${JSON.stringify(twMessageInstance)}`);

	return _200('Success!!!');
}

module.exports.handler = async (event, context, callback) => {

	console.log(`Incoming message: ${JSON.stringify(event.body)}`)

	const originPhone = (event.body.From + '').replace(/\D/g, '');
	const targetPhone = (event.body.To + '').replace(/\D/g, '');
	const messageContent = event.body.Body;

	// Get conversations where the origin phone number is the user
	const userConvQueryResult = await DynamoDB.Query({
			TableName: 'conversation', 
			IndexName: 'UserPhoneIndex', 
			KeyConditionExpression: 'user_phone = :user_phone',
			ExpressionAttributeValues: {':user_phone': originPhone} 
		}, 
		'User Conversation Query');

	const isUser = userConvQueryResult.Items.filter(c => originPhone == c.user_phone && targetPhone == c.light_phone_proxy).length > 0;
	if (isUser)
	{
		const userQueryResult = await DynamoDB.Query({
			TableName: 'user',
			IndexName: 'PhoneNumberIndex',
			KeyConditionExpression: 'phone_number = :phone_number',
			ExpressionAttributeValues: { ':phone_number': originPhone }
		}, 'User Query');
		
		const user = userQueryResult.Items[0];
		if (user.message_allowance < 1)
			return _400('User has exceeded message allowance');
		
		const sendMessageResult = await getConversationAndSendMessage(userConvQueryResult.Items, originPhone, isUser, messageContent);

		user.message_allowance -= 1;
		const db = new AWS.DynamoDB.DocumentClient();
		const userSaveResult = await db.put({TableName: 'user', Item: user}).promise();
		console.log(`User Save Result: ${JSON.stringify(userSaveResult)}`)

		return sendMessageResult;
	}
	else
	{
		// Get the conversations where the origin phone number is the lightuser
		const lightConvQueryResult = await DynamoDB.Query({
			TableName: 'conversation', 
			IndexName: 'LightPhoneIndex', 
			KeyConditionExpression: 'light_phone = :light_phone',
			ExpressionAttributeValues: {':light_phone': originPhone} 
		}, 
		'LightUser Conversation Query');

		return await getConversationAndSendMessage(lightConvQueryResult.Items, originPhone, isUser, messageContent);
	}
};
