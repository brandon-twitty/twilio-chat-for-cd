'use strict';
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(twilioAccountSid, twilioAuthToken);

// Required in responses for CORS support to work
const headers = {'Access-Control-Allow-Origin': '*'};
const http = require('serverless-http');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
module.exports.receiveSms = (event, context, callback) => {
    let message = `Incoming message from ${event.body.From}: ${event.body.Body}`;
    console.log(`Incoming message from ${event.body.From}: ${event.body.Body}`);

    const twiml = new MessagingResponse();
    twiml.message(message);
    const sms = {
        /*body: 'Hello from Lambda!',
        to: '+13145995164',  // your phone number
        from: '+13143103033' // a valid Twilio number*/
        to: event.body.From,
        body: event.body.message || '',
        from: event.body.to,
    };
    if (message != null){
        twilioClient.messages.create(sms, (error, data) => {
            if (error) {

                const twilioErrResponse = {
                    headers: headers,
                    statusCode: 200,
                    body: JSON.stringify({
                        status: 'fail',
                        message: error.message,
                        error: error
                    })
                };

                return callback(null, twilioErrResponse);
            }
            // If no errors: Return success response!

            const successResponse = {
                headers: headers,
                statusCode: 200,
                body: JSON.stringify({
                    status: 'success',
                    message: 'Text message successfully sent!',
                    body: data.body,
                    created: data.dateCreated
                })
            };

            callback(null, successResponse);
        }).then(message => console.log(message.sid))
    }
};
