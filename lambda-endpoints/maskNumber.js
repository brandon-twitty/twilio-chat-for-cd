'use strict';
const Responses = require('../common/API_Response');
const Dynamo = require('../common/Dynamo');
const AWS = require('aws-sdk');
const uuid = require ("uuid");
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(twilioAccountSid, twilioAuthToken);

module.exports.handler = async ( event, context, callback) => {
    console.log('event', event);

    const maskedUsersNumbers = twilioClient.incomingPhoneNumbers
        .list()
        .then(incomingPhoneNumbers => {
            incomingPhoneNumbers.forEach(function(incomingPhoneNumbers) {
                JSON.stringify({
                    maskedUsersNumber: maskedUsersNumbers.phoneNumber
                })
            });
            for (const maskedUsersNumber of maskedUsersNumbers) {
                console.log('stringed twilio numbers',maskedUsersNumbers)
            }
        });
// update conversation database with the proxy phone numbers that belong to the conversation

};

