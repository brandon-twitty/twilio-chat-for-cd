'use strict';
// request incoming from webhook
// const request = require('request');
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(twilioAccountSid, twilioAuthToken);

// Required in responses for CORS support to work
const headers = {'Access-Control-Allow-Origin': '*'};

module.exports.sendSms = (event, context, callback) => {
    const sms = {
        /*body: 'just admit u like thr Pen15 breath',
        to: '+13142105269',  // your phone number
        from: '+13143103033' // a valid Twilio number*/
        to: event.body.to,
        body: event.body.message || '',
        from: event.body.from
    };
}
    /*twilioClient.messages.create(sms, (error, data) => {
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
};*/
