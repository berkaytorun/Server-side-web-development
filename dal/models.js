"use strict";

const Sequelize = require('sequelize')
var sqlite3 = require('sqlite3').verbose();

const ValidatorObjects = require('./model_validator')

const accValid = ValidatorObjects.accValid
const bookValid = ValidatorObjects.bookValid
const messValid = ValidatorObjects.messValid

const init = function(options) {
    return new Promise(function(resolve, reject) {
        const db = new Sequelize('joyl', 'joyl', 'joyljoyl', {
            host: 'localhost',
            dialect: 'sqlite',

            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },

            // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
            //operatorsAliases: false,
            storage: __dirname + '/database.sqlite'
        })

        const Account = db.define("account", {
            userName: {
                type: Sequelize.STRING(accValid.name.max),
                allowNull: false,
                unique: {
                    args: true,
                    msg: "That user name already exists."
                },
                validate: {
                    len: {
                        args: [accValid.name.min, accValid.name.max],
                        msg: "Username needs to be between " +
                            accValid.name.min + " and " +
                            accValid.name.max + " characters long."
                    }
                }
            },
            password: {
                type: Sequelize.STRING(accValid.passw.max),
                allowNull: false,
                validate: {
                    len: {
                        args: [accValid.passw.min, accValid.passw.max],
                        msg: "Password needs to be between " +
                            accValid.passw.min + " and " +
                            accValid.passw.max + " characters long."
                    }
                }
            },            
        })

        const Book = db.define('book', {
            name: {
                type: Sequelize.STRING(bookValid.name.max),
                unique: {
                    args: true,
                    msg: ""
                },
                allowNull: false,
                validate: {
                    len: {
                        args: [bookValid.name.min, bookValid.name.max],
                        msg: "Book name needs to be between " +
                            bookValid.name.min + " and " +
                            bookValid.name.max + " characters long."
                    }
                }
            },
            description: {
                type: Sequelize.STRING(bookValid.desc.max),
                allowNull: true,
                validate: {
                    len: {
                        args: [bookValid.desc.min, bookValid.desc.max],
                        msg: "Description needs to be between " +
                            bookValid.desc.min + " and " +
                            bookValid.desc.max + " characters long."
                    }
                }
            }
        })

        db.sync({force: options}).then(() => {
            resolve({
                Account: Account,
                Book: Book
            })
        });
        /*
        db.query('SET FOREIGN_KEY_CHECKS = 0')
        .then(function() {
            return db.sync(options)
        }).then(function() {
            return db.query('SET FOREIGN_KEY_CHECKS = 1')
        }).then(function() {
        }).catch(function(reason) {
            reject(reason)
        })
        */
    })
}


exports.init = init