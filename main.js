// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

'use strict'

const { fetchBoards } = require('./lib/fetcher');
const { generateICSCalendar } = require('./lib/icalendar');



async function getAllCalendars() {
    return (await fetchBoards()).map(x => generateICSCalendar(x));
}


module.exports = {
    getAllCalendars,
};
