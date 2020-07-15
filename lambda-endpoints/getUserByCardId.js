'use strict';
const Dynamo= require( '../common/Dynamo');
const DynamoDB = require('../common/DynamoDB');
exports.handler = async (event) => {
    console.log(event);
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
const getUserByCardId = async event => {
    let card_Id = event.pathParmeters.cardId;
    let data = await Dynamo.scan('card_id', card_Id, 'user');
    console.log('get user data by card Id', data);
    return data;
};
