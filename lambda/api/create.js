'use strict';
const AWS = require('aws-sdk');
const project = require('../config/project.config');

const options = {
    region: 'eu-west-1',
};

// if (process.env.IS_OFFLINE) {
//     options.s3ForcePathStyle = true;
//     options.endpoint = new AWS.Endpoint(project.s3_server_host);
// }

const S3 = new AWS.S3(options);

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
        Bucket: process.env.SNIPPET_BUCKET_NAME,
        Key: snippetId,
        Body: new Buffer(body.code),
        ACL: 'public-read',
    };

    S3.upload(params, (err, data) => {
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
