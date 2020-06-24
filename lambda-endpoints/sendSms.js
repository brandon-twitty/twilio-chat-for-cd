'use strict';
const Responses = require('../common/API_Response');
    const Dynamo = require('../common/Dynamo');
const AWS = require('aws-sdk');
const uuid = require ("uuid");
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(twilioAccountSid, twilioAuthToken);

module.exports.handler = async ( event, context, callback) => {

    const sms = {
        to: event.body.userProfilePhone,
        from: event.body.lightUsersPhoneNumber,
        body: event.body.lightUsersName + 'Has received one of your card date card and wises to speak to you' + event.body.initialMessage,
    };

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
    }).then(message => console.log(message.sid));


};
