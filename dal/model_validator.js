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
    ISBN: {
        min: 15,
        max: 15
    },
    title: {
        min: 3,
        max: 40
    },
    publicationYear: {
        fixedSize: 10
    },
    publicationInfo: {
        min: 0,
        max: 255
    },
    pages: {
        min: 0,
        max: 255
    }

}
const classifications = {
    signum: {
        min: 0,
        max: 50
    },
    description: {
        min: 0,
        max: 255
    }
}

const author = {
    firstName: {
        min: 0,
        max: 50
    },
    lastName: {
        min: 0,
        max: 50
    },
    birthYear: {
        min: 0,
        max: 10
    }
}

exports.accValid = accValid
exports.bookValid = bookValid
exports.classifications = classifications
exports.author = author