'use strict'

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(twilioAccountSid, twilioAuthToken);

class SmsService
{
	constructor()
	{

	}

	async send(target, origin, content)
	{
		const twMessage = {
			from: origin, 
			to: target, 
			body: content
		};
		console.log(`Sending message: ${JSON.stringify(twMessage)}`);
		const twMessageInstance = await twilioClient.messages.create(twMessage);
		console.log(`Twilio Response: ${JSON.stringify(twMessageInstance)}`);
		return twMessageInstance;
	}
}

module.exports = SmsService;