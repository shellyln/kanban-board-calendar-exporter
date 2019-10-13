// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

'use strict'

const crypto = require('crypto');

const {
    TZ_TIMEZONE_ID,
    TZ_STD_START,
    TZ_STD_END,
    TZ_DST_START,
    TZ_DST_END,
    TZ_OFFSET,
    TZ_OFFSET_DST,
    CAL_PRODID,
    CAL_GUID_SALT,
} = require('../config/cal.config');



function escapeText(s) {
    return (s
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\t/g, ' ')
        .replace(/\v/g, ' ')
        .replace(/\\/g, '\\\\')
        .replace(/\n/g, '\\n')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
    );
}


function generateCalGuid(board) {
    const md5 = crypto.createHash('md5');
    const hash = md5.update(
        board._id + CAL_GUID_SALT, 'binary')
        .digest('hex');
    const uuid = `${
        hash.substring( 0,  0 +  8)}-${
        hash.substring( 8,  8 +  4)}-${
        hash.substring(12, 12 +  4)}-${
        hash.substring(16, 16 +  4)}-${
        hash.substring(20, 20 + 12)}`;
    return uuid;
}


function generateICSCalendar(board) {
    const calGuid = generateCalGuid(board);
    const header =
        `BEGIN:VCALENDAR\r\n` +
        `PRODID:${CAL_PRODID}\r\n` +
        `VERSION:2.0\r\n` +
        `METHOD:PUBLISH\r\n` +
        `CALSCALE:GREGORIAN\r\n` +
        `BEGIN:VTIMEZONE\r\n` +
        `TZID:${TZ_TIMEZONE_ID}\r\n` +
        `BEGIN:STANDARD\r\n` +
        `DTSTART:${TZ_STD_START}\r\n` +
        (TZ_STD_END ? `DTEND:${TZ_STD_END}\r\n` : '') +
        `TZOFFSETFROM:${TZ_OFFSET_DST}\r\n` +
        `TZOFFSETTO:${TZ_OFFSET}\r\n` +
        `END:STANDARD\r\n` +
        (TZ_DST_START ? (
            `BEGIN:DAYLIGHT\r\n` +
            `DTSTART:${TZ_STD_START}\r\n` +
            (TZ_STD_END ? `DTEND:${TZ_STD_END}\r\n` : '') +
            `TZOFFSETFROM:${TZ_OFFSET}\r\n` +
            `TZOFFSETTO:${TZ_OFFSET_DST}\r\n` +
            `END:DAYLIGHT\r\n`
        ) : '') +
        `END:VTIMEZONE\r\n` +
        `X-WR-CALNAME:${escapeText(board.name)}\r\n` +
        `X-WR-CALDESC:${escapeText(board.name)}\r\n` +
        `X-WR-RELCALID:${calGuid}\r\n` +
        `X-WR-TIMEZONE:${TZ_TIMEZONE_ID}\r\n`;

    const events = board.records.filter(k => !!(k.dueDate)).map(k => {
        const description = escapeText(k.description.replace(/#/g, '').trim());
        const summary = (description.split('\\n')[0] || 'No title').trim();
        const dueDate = (k.dueDate || '').replace(/-/g, '').substring(0, 8);
        return (
            `BEGIN:VEVENT\r\n` +
            `UID:knbncal/${calGuid}/${k._id}\r\n` +
            // `DTSTAMP:${dueDate + 'T000000Z'}\r\n` + // DTSTAMP is not for the all day event
            `DTSTART:${dueDate}\r\n` +
            `DTEND:${dueDate}\r\n` +
            `SUMMARY:${summary}\r\n` +
            `DESCRIPTION:${description}\r\n` +
            `LOCATION:${''}\r\n` +
            `END:VEVENT\r\n`
        );
    });

    const footer = `END:VCALENDAR\r\n`;

    return ({
        uuid: calGuid,
        name: board.name,
        calendar: `${header}${events.join('')}${footer}`,
    });
}


module.exports = {
    generateICSCalendar,
};
