
const Book = require("./models/book_model").Book
const Author = require("./models/author_model").Author
const Classification = require("./models/classification_model").Classification

exports.initRelations = function() {
    const resetDatabase = true

    Book.belongsTo(Classification, {foreignKey: 'signId'})
    
    Author.belongsToMany(Book, { through: "bookauthor"} )
    Book.belongsToMany(Author, { through: "bookauthor"} )
    
    return resetDatabase
}

exports.initMockData = function () {
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

}