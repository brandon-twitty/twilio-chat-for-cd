'use strict';
const Dynamo= require( '../common/Dynamo');
const DynamoDB = require('../common/DynamoDB');
exports.handler = async (event) => {
    console.log('get user by card_id event=',event);
    if (event.httpMethod === 'GET') {
        let response = await getUserByCardId(event);
        return done(response);
    }
};
const done = response => {
    return {
        statusCode: '200',
        body: JSON.stringify(response.Items),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*'
        }
    }
};
const getUserByCardId = async (event, context, callback) => {
    const card_id = event.pathParmeters.card_id;
    const results = await DynamoDB.Query({
        TableName: 'user',
        IndexName: 'cardIdIndex',
        KeyConditionExpression: 'card_id = :card_id',
        ExpressionAttributeValues: { 'card_id': card_id }
    }, 'User Query');
    const user = results.Items[0];
    return user;
    /*let data = await Dynamo.scan('card_id', card_Id, 'user');
    console.log('get user data by card Id', data);
    return data;*/
};
