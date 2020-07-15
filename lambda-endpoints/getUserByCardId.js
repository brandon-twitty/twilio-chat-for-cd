'use strict';
const Dynamo= require( '../common/Dynamo');
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
    let cardId = event.pathParmeters.cardId;
    let data = await Dynamo.scan('card_id', cardId, 'user');
    console.log(data);
    return data;
};
