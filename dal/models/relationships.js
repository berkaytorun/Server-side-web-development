
const Book = require("./book_model").Book
const Author = require("./author_model").Author
const Classification = require("./classification_model").Classification


exports.init = function() {
    
    Book.belongsTo(Classification, {foreignKey: 'signId'})
    
    Author.belongsToMany(Book, { through: "bookauthor"} )
    Book.belongsToMany(Author, { through: "bookauthor"} )
    
}
