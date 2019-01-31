"use strict";

const Sequelize = require('sequelize')

const ValidatorObjects = require('./model_validator')

const accValid = ValidatorObjects.accValid
const bookValid = ValidatorObjects.bookValid
const classifications = ValidatorObjects.classifications
const author = ValidatorObjects.author

const init = function(options) {
    return new Promise(function(resolve, reject) {
        const db = new Sequelize('joyl', 'joyl', 'joyljoyl', {
            host: 'localhost',
            dialect: 'sqlite',
            operatorsAliases: false,

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
                type: Sequelize.TEXT(accValid.name.max),
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
                type: Sequelize.TEXT(accValid.passw.max),
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
            ISBN: {
                type: Sequelize.TEXT,
                primaryKey: true,
                unique: {
                    args: true,
                    msg: "That ISBN already exists."
                }
            },
            title: {
                type: Sequelize.TEXT(bookValid.title.max),
                allowNull: true,
                validate: {
                    len: {
                        args: [bookValid.title.min, bookValid.title.max],
                        msg: "Book title needs to be between " +
                            bookValid.title.min + " and " +
                            bookValid.title.max + " characters long."
                    }
                }
            },
            signId: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            publicationYear: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                    isNumeric: {
                        args: true,
                        msg: "Publication-year can only have numeric values."
                    },
                    len: {
                        args: [bookValid.publicationYear.fixedSize, bookValid.publicationYear.fixedSize],
                        msg: "Publication-year needs to be " +
                            bookValid.publicationYear.fixedSize + " digits long."
                    }
                }
            },
            publicationInfo: {
                type: Sequelize.TEXT(bookValid.title.max),
                allowNull: true,
                validate: {
                    len: {
                        args: [bookValid.title.min, bookValid.title.max],
                        msg: "Publication-info field needs to be between " +
                            bookValid.publicationInfo.min + " and " +
                            bookValid.publicationInfo.max + " characters long."
                    }
                }
            },
            pages: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                    len: {
                        args: [bookValid.title.min, bookValid.title.max],
                        msg: "Pages field needs to be between " +
                            bookValid.pages.min + " and " +
                            bookValid.pages.max + " digits long."
                    }
                }
            },
        })

        const Classification = db.define('classification', {
            signId: {
                type: Sequelize.TEXT,
                primaryKey: true,
            },
            signum: {
                type: Sequelize.TEXT,
                allowNull: true,
                validate: {
                    len: {
                        args: [classifications.signum.min, classifications.signum.max],
                        msg: "ISBN must be between exactly " + bookValid.ISBN.min + " characters long."
                    }
                }
            },
            description: {
                type: Sequelize.TEXT,
                validate: {
                    len: {
                        args: [bookValid.ISBN.min, bookValid.ISBN.max],
                        msg: "ISBN must be between exactly " + bookValid.ISBN.min + " characters long."
                    }
                }
            }
        })

        Book.belongsTo(Classification, {foreignKey: 'signId'})


        const Author = db.define('author', {
            Id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
            },
            firstName: {
                type: Sequelize.TEXT,
                validate: {
                    len: {
                        args: [author.firstName.min, author.firstName.max],
                        msg: "First name must be between " + author.firstName.min + " and " + author.firstName.max + " characters long."
                    }
                }
            },
            lastName: {
                type: Sequelize.TEXT,
                validate: {
                    len: {
                        args: [author.lastName.min, author.lastName.max],
                        msg: "Last name must be between " + author.lastName.min + " and " + author.lastName.max + " characters long."
                    }
                }
            },
            birthYear: {
                type: Sequelize.TEXT,
                allowNull: true,
                validate: {
                    len: {
                        args: [author.birthYear.min, author.birthYear.max],
                        msg: "Birthday must be between exactly " + bookValid.ISBN.min + " characters long."
                    }
                }
            }

        })

        const BookAuthor = db.define('bookAuthor', { })
        Book.belongsToMany(Author, { through: BookAuthor} )
        Author.belongsToMany(Book, { through: BookAuthor} )



        db.sync({force: options}).then(() => {
            resolve({
                Account: Account,
                Author: Author,
                Book: Book,
                BookAuthor: BookAuthor,
                Classification: Classification
            })
        });
    })
}

exports.init = init