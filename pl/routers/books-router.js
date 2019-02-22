
const express = require('express')
const router = express.Router();

const bll = require("../../bll/books-manager")

const generatePageNumbers = require("../functionality/functionality").generatePageNumbers

router.get("/create", function(req, res) {
    res.render("books/book_create.hbs")
})

router.post("/create", function(req, res) {
    
    const book = {
        ISBN: req.body.ISBN,
        title: req.body.title,
        publicationInfo:req.body.publicationInfo,
        publicationYear:req.body.publicationYear,
        pages:req.body.pages,
    }
    
    bll.create(req.session, book)
    .then(function(book) {
        const model = {
            book: book,
            session: req.session
        }
        res.render("books/book_view.hbs", model)
    }).catch(function(errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("error.hbs", model)
    })
})

router.post("/delete/:ISBN", function(req, res) {
    
    const book = {ISBN: req.params.ISBN}

    bll.delete(req.session, book)
    .then(function() {
        const message = {
            errors: [
                {message: "Book was removed"}
            ]
        }
        res.render("error.hbs", message)
    }).catch(function(errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("error.hbs", model)
    })
})

// search for many books that match a string and filters
router.get("/", function(req, res) {
    
    bll.searchBooks(req.query)
    .then(function(wrapper) {
        const books = wrapper[0]
        const classifications = wrapper[1]

        if (req.query.classification) {
            for (let i = 0; i < classifications.length; i++) {
                if (classifications[i].signum == req.query.classification) {
                    classifications[i].isSelected = true
                }
            }
        }

        const pages = (books.count) / req.query.limit
        const pagesArray = generatePageNumbers(pages, req.query.currentPage)
        
        const model = {
            pages: pagesArray,
            books: books,
            classifications: classifications,
            currentClassification: req.query.classification,
            searchString: req.query.searchString,
            table: req.baseUrl,
            placeholder: "Search for a title or an ISBN",
            session: req.session
        }
        res.render("books/books_list.hbs", model)
    }).catch(function(errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("error.hbs", model)
    })
})

router.get("/edit/:ISBN", function(req, res) {
    const book = {
        ISBN: req.params.ISBN
    }
    bll.getBookInfo(book)
    .then(function(book) {
        const model = {
            book: book,
            session: req.session
        }
        res.render("books/book_edit.hbs", model)
    }).catch(function(errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("error.hbs", model)
    })
})

router.post("/edit/:ISBN", function(req, res) {
    const book = {
        title: req.body.title,
        pages:req.body.pages,
        publicationInfo:req.body.publicationInfo,
        publicationYear:req.body.publicationYear,
    }
    const oldISBN = req.params.ISBN
    bll.update(req.session, book, oldISBN)
    .then(function() {
        const book = {
            ISBN: req.query.ISBN
        }
        return bll.getBookInfo(book)
    }).then(function(bookInfo) {
        res.render("books/book_view.hbs", bookInfo)
    }).catch(function(errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("error.hbs", model)
    })
})

// Search for a specific book via ISBN
router.get("/:ISBN", function (req, res) {
    const book = {
        ISBN: req.params.ISBN
    }
    bll.getBookInfo(book)
    .then(function(book) {
        const model = {
            book: book,
            session: req.session
        }
        res.render("books/book_view.hbs", model)
    }).catch(function(errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("error.hbs", model)
    })
})




module.exports = router