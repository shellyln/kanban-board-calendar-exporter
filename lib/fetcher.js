// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

'use strict'

const util   = require('util');
const https  = require('https');

const {
    DB_ENDPOINT_DOMAIN,
    DB_ENDPOINT_PATH,
    DB_USER,
    DB_PASSWORD,
} = require('../config/db.config');



// https://gist.github.com/krnlde/797e5e0a6f12cc9bd563123756fc101f
https.request[util.promisify.custom] = (options) => {
    return new Promise((resolve, reject) => {
        https.request(options, (response) => {
            if (response.statusCode !== 200) {
                reject(`failed: ${response.statusCode}`)
            } else {
                response.end = new Promise((resolve) => response.on('end', resolve));
                resolve(response);
            }
        })
        .on('error', reject)
        .end();
    });
};

const httpsRequest = util.promisify(https.request);


async function fetchBoards() {
    const response = await httpsRequest({
        hostname: DB_ENDPOINT_DOMAIN,
        port: 443,
        path: `${DB_ENDPOINT_PATH}/_all_docs?include_docs=true`,
        method: 'GET',
        auth: `${DB_USER}:${DB_PASSWORD}`,
    });

    let body = '';
    response.setEncoding('utf8');
    response.on('data', (chunk) => body += chunk);
    await response.end;

    const data = JSON.parse(body);
    // console.log(JSON.stringify(data));

    const boards = data.rows.filter(x => x.doc.type === 'kanbanBoard').map(x => x.doc);
    // console.log(JSON.stringify(boards, null, 2));

    boards.forEach(x => {
        x.records = data.rows.filter(k => k.doc.type === 'kanban' && k.doc.boardId === x._id).map(k => k.doc);
    });
    // console.log(JSON.stringify(boards, null, 2));

    return boards;
}


module.exports = {
    fetchBoards,
};
