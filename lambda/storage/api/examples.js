'use strict';
const aws = require('aws-sdk');

const options = {
    region: 'eu-west-1',
};

function listObjects(s3, params) {
    return new Promise((resolve, reject) => {
        s3.listObjects(params, (err, data) => {
            if (err) return reject(err);
            return resolve(data);
        });
    });
}

function trimPrefix(prefix) {
    const pattern = /examples\/(\w+)\//;
    return prefix.match(pattern)[1];
}

function trimItem(key) {
    const pattern = /examples\/\w+\/(.*)/;
    return key.match(pattern)[1];
}

function makeBody(data) {
    const result = {};

    data.forEach((set) => {
        result[trimPrefix(set.Prefix)] = set.Contents.map((item) => trimItem(item.Key));
    });

    return {
        examples: result,
    };
}

module.exports.handler = (event, context, callback) => {
    const s3 = new aws.S3(options);

    const params = {
        Bucket: 'es6console',
        Delimiter: '/',
        Prefix: 'examples/',
    };

    s3.listObjects(params, (err, data) => {
        if (err) return callback(err);

        const prefixes = data.CommonPrefixes.map((item) => item.Prefix);

        Promise.all(prefixes.map((prefix) => 
            listObjects(s3, {
                Bucket: 'es6console',
                Delimiter: '/',
                Prefix: prefix,
            })
        )).then((data) => {
            const content = makeBody(data);
            const response = {
                statusCode: 200,
                body: JSON.stringify(content),
            };

            return callback(null, response);
        }).catch((err) => {
            return callback(err);
        });
        
    });
};
