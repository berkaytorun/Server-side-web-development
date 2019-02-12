
const Account = require("./models/account_model").Account

const Book = require("./models/book_model").Book
const Author = require("./models/author_model").Author
const Classification = require("./models/classification_model").Classification
const BookAuthor = require("./models/book_author_model").BookAuthor

exports.initRelations = function() {

    Book.belongsTo(Classification, {foreignKey: 'signId'})
    
    Author.belongsToMany(Book, { through: BookAuthor} )
    Book.belongsToMany(Author, { through: BookAuthor} )
        
}

exports.initMockData = function (db) {
    const mockData = require("./mock_data").mockData

    /* */
    BookAuthor.bulkCreate(mockData.bookAuthors, {ignoreDuplicates: true})
    .then(function(bookauthors) {

    }).catch(function(err) {
        throw "Couldn't initiate mockdata bookauthors"
    })
    /* */

    /* */
    Author.bulkCreate(mockData.authors, {ignoreDuplicates: true})
    .then(function(authors) {
        
    }).catch(function(reason) {
        throw "Couldn't initiate mockdata authors"
    })
    /* */
    
    /* */
    Classification.bulkCreate(mockData.classifications, {ignoreDuplicates: true})
    .then(function(classifications) {
        
    }).catch(function(reason) {
        throw "Couldn't initiate mockdata classifications"
    })
    /* */

    /* */
    Book.bulkCreate(mockData.books, {ignoreDuplicates: true})
    .then(function(books) {
        
    }).catch(function(reason) {
        throw "Couldn't initiate mockdata books"
    })
    /* */
}