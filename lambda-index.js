// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

'use strict'

const { getAllCalendars } = require('./main');

const {
    S3_REGION,
    S3_BUCKET_NAME,
} = require('./config/s3.config');

const AWS = require('aws-sdk');
const s3 = new AWS.S3({region: S3_REGION});



exports.handler = async (event, context) => {
    const calendars = await getAllCalendars();

    const promises = calendars.map(cal => {
        const params = {
            Bucket: S3_BUCKET_NAME,
            Key: `${cal.uuid}.ics`,
            Body: cal.calendar,
            ContentType: 'text/calendar',
            ACL: 'public-read',
        };

        return s3.upload(params).promise();
    });

    await Promise.all(promises);
};
