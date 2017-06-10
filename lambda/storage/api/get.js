'use strict';
const dynamo = require('./dynamodb');

module.exports.handler = (event, context, callback) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: {
                S: event.pathParameters.id,
            }
        }
    };

    dynamo.getItem(params, (err, data) => {
        if (err) return callback(err);

        if (! Object.hasOwnProperty.call(data, 'Item')) {
            return callback(null, { statusCode: 404 });
        }

        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                message: 'Retrieved snippet',
                snippet: data.Item.code.S,
            }),
        };

        callback(null, response);
    });
};
