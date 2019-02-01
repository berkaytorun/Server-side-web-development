
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
                /* remove this on release
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
                */
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