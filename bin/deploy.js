const AWS = require('aws-sdk');

const fs = require('fs');
const klaw = require('klaw');
const path = require('path');
const debug = require('debug')('app:bin:deploy');
const crypto = require('crypto');
const project = require('../config/project.config');
const through2 = require('through2');
const mime = require('mime-types');
const argv = require('yargs').argv

const s3 = new AWS.S3({
    region: 'eu-west-1',
});

const cf = new AWS.CloudFront({});

function promisify(fn, thisScope) {
    return function decorator(...args) {
        return new Promise((resolve, reject) => {
            args.push((err, data) => {
                if (err) return reject(err);
                return resolve(data);
            });

            fn.apply(thisScope, args);
        });
    };
}

const readFile = promisify(fs.readFile);
const s3HeadObject = promisify(s3.headObject, s3);
const s3Upload = promisify(s3.upload, s3);

function stripPath(inputPath, absPathPrefix) {
    return inputPath.slice(absPathPrefix.length + 1);
}

function uploadFile(objectKey, fileData) {
    debug('Uploading file', objectKey);

    return s3Upload({
        Bucket: project.bucket_name,
        Key: objectKey,
        Body: fileData,
        ContentType: mime.contentType(objectKey),
    });
}

function checkMD5AndUpload(absPathPrefix, item) {
    const objectKey = stripPath(item.path, absPathPrefix);

    let fileMD5, fileData;

    return readFile(item.path)
        .then(
            (fd) => {
                fileData = fd;
                fileMD5 = crypto.createHash('md5').update(fileData).digest('hex');

                return s3HeadObject({
                    Bucket: project.bucket_name,
                    Key: objectKey,
                });
            },
            (err) => {
                debug('Unable to read file', item.path, err);
            }
        )
        .then(
            (data) => {
                if (! data) return;

                const etag = JSON.parse(data['ETag']);

                if (!argv.all && fileMD5 !== etag) {
                    return uploadFile(objectKey, fileData);
                }
            }, 
            (err) => {
                if (err.code === 'NotFound') 
                    return uploadFile(objectKey, fileData);
                debug('ERROR S3', objectKey, err);
            }
        )
        .catch(
            (err) => {
                debug('Uncaught Error', err);       
            }
        );
}

const deploy = (directory, absPathPrefix) => {
    absPathPrefix = absPathPrefix || directory;

    debug('Performing Deploy', directory);
    debug('NODE_ENV', project.env);

    const upload = through2.obj(function(item, enc, next) {
        const result = checkMD5AndUpload(absPathPrefix, item);
        this.push(result);
        next();
    });

    const excludeDirFilter = through2.obj(function(item, enc, next) {
        if (! item.stats.isDirectory()) this.push(item);
        next();
    });

    const waitForCompletion = through2.obj(function(item, enc, next) {
        item.then(() => next(), () => next());
    });

    return klaw(directory)
        .pipe(excludeDirFilter)
        .pipe(upload)
        .pipe(waitForCompletion)
        .on('data', () => {
            debug('DONE');
        })
};

const dist = path.join(__dirname, '../dist');
const themes = path.join(__dirname, '../node_modules/codemirror/theme');

deploy(dist)
    .on('end', () => {
        deploy(themes, path.join(__dirname, '../node_modules'))
            .on('end', () => {
                const params = {
                    DistributionId: 'EDV35IT95U5Q7',
                    InvalidationBatch: {
                        CallerReference: `${Date.now()}`,
                        Paths: {
                            Quantity: 1,
                            Items: ['/index.html'],
                        }
                    }
                };

                cf.createInvalidation(params, (err, data) => {
                    if (err) return debug('Failed invalidation:', err.message);

                    debug('Succesfully invalidated index.html');
                });
            });
    });
