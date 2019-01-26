"use strict";

const accValid = {
    name: {
        min: 3,
        max: 25
    },
    passw: {
        min: 3,
        max: 200
    }
}

const bookValid = {
    name: {
        min: 3,
        max: 40
    },
    desc: {
        min: 0,
        max: 100
    },
    passw: {
        min: 0,
        max: 200
    }
}

exports.accValid = accValid
exports.bookValid = bookValid