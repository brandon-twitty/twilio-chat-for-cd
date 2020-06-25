'use strict';
const Responses = require('../common/API_Response');
const Dynamo = require('../common/Dynamo');
const AWS = require('aws-sdk');
const uuid = require ("uuid");

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(twilioAccountSid, twilioAuthToken);
// Required in responses for CORS support to work

module.exports.handler = function (params) {

    console.log('params', params);

    if (!params){
        return Responses._400({ message: 'now message body' });
    }
    const newConversation = {
        conversationSid: uuid.v1(),
        initialMessage: params.initialMessage,
        lightUsersPhoneNumber: params.lightUsersPhoneNumber,
        userProfileUserId: params.userProfileUserId,
        userProfilePhone: params.userProfilePhone
    };
};

