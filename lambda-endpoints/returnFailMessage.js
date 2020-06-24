'use strict';
const Responses = require('../common/API_Response');
const Dynamo = require('../common/Dynamo');
const AWS = require('aws-sdk');
const uuid = require ("uuid");
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(twilioAccountSid, twilioAuthToken);

module.exports.handler = async ( event, context, callback) => {};
