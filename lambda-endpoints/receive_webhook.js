'use strict';
const Responses = require('../common/API_Response');
const Dynamo = require('../common/Dynamo');
    const AWS = require('aws-sdk');
    const uuid = require ("uuid");

    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioClient = require('twilio')(twilioAccountSid, twilioAuthToken);
 // request incoming from webhook
// const request = require('request');
// Required in responses for CORS support to work
const headers = {'Access-Control-Allow-Origin': '*'};
const http = require('serverless-http');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

var lambda = new AWS.Lambda();
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.receiveSms = async (event, context, callback) => {
    let phoneNumber = event.body.to;
    let message = `Incoming message from ${event.body.From}: ${event.body.Body}: ${event.body.to}`;
    console.log(`Incoming message from ${event.body.From}: ${event.body.Body}`);
    const twiml = new MessagingResponse();
    twiml.message(message);

    const incomingMessageMetaData = {
        headers: headers,
        statusCode: 200,
        body: JSON.stringify({
            messageSid: event.body.messageSid,
            initialMessage: event.body.Body,
            lightUsersPhoneNumber: event.body.From,

        })

    };
    let TableName = 'user';
    const params ={
        TableName,
        Key: {
            phoneNumber: event.body.to,
        },

    };
    const validUser = await documentClient.get(params).promise();
    if (!validUser || !validUser.Item) {
        throw Error(`There was an error fetching the phone number of ${phoneNumber} from ${TableName}`);
    }
    console.log(validUser);
    console.log(incomingMessageMetaData);
    // is this a first time message?



    // Does the incoming new message have a user return true or false to initiate conversation?


   /* var newMessageResponse = {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        },

        "body": "{\n  \"validNumber\": true,\n}"

    };
    var lambdaParams = {
        FunctionName: "initializeConversation",
        Payload: incomingMessageMetaData,
        Qualifier: "1"
    };
    lambda.invokeAsync(lambdaParams, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
        /*
        data = {
         Payload: ,
         StatusCode: 200
        }

    });*/



};
