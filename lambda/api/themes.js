'use strict';
const aws = require('aws-sdk');
const project = require('../config/project.config.js');

const options = {
    region: 'eu-west-1',
};

function trimItem(key) {
    const pattern = /codemirror\/theme\/([^.]*)\.css$/;
    return key.match(pattern)[1];
}

function makeBody(data) {
    return {
        themes: data.Contents.map((item) => trimItem(item.Key)),
    };
}

module.exports.handler = (event, context, callback) => {
    const s3 = new aws.S3(options);

    const params = {
        Bucket: project.bucket_name,
        Delimiter: '/',
        Prefix: 'codemirror/theme/',
    };

    s3.listObjects(params, (err, data) => {
        if (err) return callback(err);

        const content = makeBody(data);
        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(content),
        };

        callback(null, response);
    });
};
