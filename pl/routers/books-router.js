
const express = require('express')
const router = express.Router();

const bll = require("../../bll/books-manager")

const generatePageNumbers = require("../functionality/help_functions").generatePageNumbers

router.get("/create", function(req, res) {
    res.render("books/book_create.hbs")
})

router.post("/create", function(req, res) {
    
    bll.createBook(req)
    .then(function(book) {
        res.render("books/book_view.hbs", book)
    }).catch(function(errors) {
        const model = {
            errors: errors
        }
        res.render("error.hbs", model)
    })
})

router.post("/delete/:ISBN", function(req, res) {
    
    req.query.ISBN = req.params.ISBN
    bll.bookDelete(req)
    .then(function() {
        const message = {
            errors: [
                {message: "Book was removed"}
            ]
        }
        res.render("error.hbs", message)
    }).catch(function(error) {
        res.render("error.hbs", error)
    })
})

// search for many books that match a string and filters
router.get("/", function(req, res) {
    
    bll.searchBooks(req)
    .then(function(books) {
        const pages = (books.count) / req.query.limit
        const pagesArray = generatePageNumbers(pages, req.query.currentPage)
        
        const model = {
            pages: pagesArray,
            books: books,
            searchString: req.query.searchString,
            table: req.baseUrl
        }
        res.render("books/books_list.hbs", model)
    }).catch(function(error) {
        res.render("error.hbs", error)
    })
})


router.get("/search", function(req, res) {
    res.render("books/books_search.hbs")
})


router.get("/edit/:ISBN", function(req, res) {
    req.query.ISBN = req.params.ISBN
    bll.getBookInfo(req)
    .then(function(book) {
        const model = {
            book: book
        }
        res.render("books/book_edit.hbs", model)
    }).catch(function(error) {
        res.render("error.hbs", error)
    })
})

router.post("/edit/:ISBN", function(req, res) {
    req.query.ISBN = req.params.ISBN
    bll.editBookInfo(req)
    .then(function(bookInfo) {

        bll.getBookInfo(req)
        .then(function(bookInfo) {
            res.render("books/book_view.hbs", bookInfo)
        }).catch(function(error) {
            res.render("error.hbs", error)
        })
    }).catch(function(error) {
        res.render("error.hbs", error)
    })
})

// Search for a specific book via ISBN
router.get("/:ISBN", function (req, res) {
    req.query.ISBN = req.params.ISBN
    bll.getBookInfo(req)
    .then(function(book) {
        const model = {
            book: book
        }
        res.render("books/book_view.hbs", model)
    }).catch(function(error) {
        res.render("error.hbs", error)
    })
})




module.exports = router