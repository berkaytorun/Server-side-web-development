
const express = require('express')
const router = express.Router();

const bookManager = require("../../bll/books-manager")
const classificationManager = require("../../bll/classifications-manager")
const bookAuthorManager = require("../../bll/book-authors-manager")

const generatePageNumbers = require("../functionality/functionality").generatePageNumbers

router.get("/create", function(req, res) {
    const model = {
        session: req.session
    }
    res.render("books/book_create.hbs", model)
})

router.post("/create", function(req, res) {
    
    const book = {
        ISBN: req.body.ISBN,
        title: req.body.title,
        publicationInfo:req.body.publicationInfo,
        publicationYear:req.body.publicationYear,
        pages:req.body.pages,
    }
    
    bookManager.create(req.session.authorityId, book)
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

    bookManager.delete(req.session.authorityId, book)
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
    
    bookManager.findAll(req.query)
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
        if (errors[0].message == "Classification empty") {
            model.signum = req.query.classification
            res.render("books/books_classification_delete.hbs", model)
        }
        else {
            res.render("error.hbs", model)
        }
    })
})

router.post("/classificationDelete/:SIGNUM", function(req, res) {
    const classification = {
        signum: req.params.SIGNUM
    }
    
    classificationManager.delete(req.session.authorityId, classification)
    .then(function() {
        return bookManager.findAll(req.query)
    }).then(function(wrapper) {

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
    let book = {
        ISBN: req.params.ISBN
    }
    bookManager.findOne(book)
    .then(function(bookInfo) {
        book = bookInfo
        return classificationManager.findAll()
    }).then(function(classifications) {
        for (let i = 0; i < classifications.length; i++) {
            if (classifications[i].signId == book.signId) {
                classifications[i].isCurrent = true
                break
            }
        }
        const model = {
            book: book,
            classifications: classifications,
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

router.post("/unlinkAuthor", function(req, res) {

    const bookAuthor = {
        authorId: req.body.authorId,
        bookISBN: req.body.bookISBN
    }

    return bookAuthorManager.delete(req.session.authorityId, bookAuthor)
    .then(function() {
        return bookManager.findOne({ISBN: bookAuthor.bookISBN})
    }).then(function(book) {
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

router.post("/edit/:ISBN", function(req, res) {
    let book = {
        ISBN: req.body.ISBN,
        title: req.body.title,
        pages:req.body.pages,
        publicationInfo:req.body.publicationInfo,
        publicationYear:req.body.publicationYear,
    }
    if (req.body.classification != "") {
        book.signId = req.body.classification
    }
    const oldISBN = req.params.ISBN
    bookManager.update(req.session.authorityId, book, oldISBN)
    .then(function() {
        const book = {
            ISBN: req.body.ISBN
        }
        return bookManager.findOne(book)
    }).then(function(bookInfo) {
        const model = {
            book: bookInfo,
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

// Search for a specific book via ISBN
router.get("/:ISBN", function (req, res) {
    const book = {
        ISBN: req.params.ISBN
    }
    bookManager.findOne(book)
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