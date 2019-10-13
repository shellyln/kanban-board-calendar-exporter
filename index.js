// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

'use strict'

const { getAllCalendars } = require('./main');



(async () => {
    try {
        const calendars = await getAllCalendars();

        for (const cal of calendars) {
            console.log(cal.uuid);
            console.log(cal.name);
            console.log();
            console.log(cal.calendar);
        }
    } catch (e) {
        console.log(e);
    }
})();
