
const Book = require("./models/book_model").Book
const Author = require("./models/author_model").Author
const Classification = require("./models/classification_model").Classification
const BookAuthor = require("./models/book_author_model").BookAuthor

exports.initRelations = function() {

    Book.belongsTo(Classification, {foreignKey: 'signId'})
    /*
    Author.belongsToMany(Book, { through: BookAuthor} )
    Book.belongsToMany(Author, { through: BookAuthor} )
    */
    
}

exports.initMockData = function (db) {
    const mockData = require("./mock_data").mockData

    /* */
    Author.bulkCreate(mockData.authors)
    .then(function(authors) {
        
    }).catch(function(reason) {
        console.log("Couldn't initiate mockdata authors")
    })
    /* */
    
    /* */
    Classification.bulkCreate(mockData.classifications)
    .then(function(classifications) {
        
    }).catch(function(reason) {
        console.log("Couldn't initiate mockdata classifications")
    })
    /* */

    /* */
    Book.bulkCreate(mockData.books)
    .then(function(books) {
        
    }).catch(function(reason) {
        console.log("Couldn't initiate mockdata books")
    })
    /* */
    
    /* */
    BookAuthor.bulkCreate(mockData.bookAuthors, {ignoreDuplicates: true})
    .then(function(events) {
        db.query('SET FOREIGN_KEY_CHECKS = 1')
    }).catch(function(err) {
        console.log("Couldn't initiate mockdata bookauthors")
    })
    /* */
}