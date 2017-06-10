'use strict';
const dynamo = require('./dynamodb');

const options = {
    region: 'eu-west-1',
};

module.exports.handler = (event, context, callback) => {
    let body;

    try {
        body = JSON.parse(event.body);
    } catch (error) {
        console.error(error);
        return callback(error);
    }

    const now = Date.now()
    const snippetId = parseInt(now, 10).toString(36);

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            id: {
                S: snippetId,
            },
            code: {
                S: body.code,   
            }
        }
    };

    dynamo.putItem(params, (err, data) => {
        if (err) {
            console.error(err);
            return callback(err);
        }

        const response = {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                message: 'Saved snippet',
                saved: true,
                id: snippetId,
            }),
        };

        callback(null, response);
    });
};
