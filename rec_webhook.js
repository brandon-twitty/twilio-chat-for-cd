'use strict';
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(twilioAccountSid, twilioAuthToken);
 // request incoming from webhook
const request = require('request');
// Required in responses for CORS support to work
const headers = {'Access-Control-Allow-Origin': '*'};
const http = require('serverless-http');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
module.exports.receiveSms = (event, context, callback) => {
    let message = `Incoming message from ${event.body.From}: ${event.body.Body}`;
    console.log(`Incoming message from ${event.body.From}: ${event.body.Body}`);

    const twiml = new MessagingResponse();
    twiml.message(message);
    const incomingMessageMetaData = {
        headers: headers,
        statusCode: 200,
        body: JSON.stringify({
            messageSid: event.body.message.sid,
        })
    };

};
