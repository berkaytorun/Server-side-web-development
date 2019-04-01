
const express = require('express')
const router = express.Router();

const bookManager = require("../../bll/books-manager")
const classificationManager = require("../../bll/classifications-manager")
const bookAuthorManager = require("../../bll/book-authors-manager")

const generatePageNumbers = require("../functionality/functionality").generatePageNumbers

router.get("/create", function(req, res) {
    res.render("books/book_create.hbs")
})

router.post("/create", async function(req, res) {
        
    const book = {
        ISBN: req.body.ISBN,
        title: req.body.title,
        publicationInfo:req.body.publicationInfo,
        publicationYear:req.body.publicationYear,
        pages:req.body.pages,
    }

    try {
        const model = {
            book: await bookManager.create(req.session.authorityId, book),
        }
        res.render("books/book_view.hbs", model)
    }
    catch (errors) {
        const model = {
            errors: errors,
        }
        res.render("status_report.hbs", model)
    }
})

router.post("/delete/:ISBN", async function(req, res) {
    
    const book = { ISBN: req.params.ISBN }

    try {
        await bookManager.delete(req.session.authorityId, book)
        const model = {
            errors: [{message: "Book was removed"}],
        }
        res.render("status_report.hbs", model)
    }
    catch (errors) {
        const model = {
            errors: errors,
        }
        res.render("status_report.hbs", model)
    }
})

// search for many books that match a string and filters
router.get("/", async function(req, res) {
    
    try {
        const booksPromise = bookManager.findAll(req.query)

        const limit = req.query.limit
        delete req.query.limit
        delete req.query.offset

        const classificationsPromise = classificationManager.findAll(req.query)
        
        const wrapper = await Promise.all([booksPromise, classificationsPromise])
        
        const books = wrapper[0]
        const classifications = wrapper[1]
        
        if (!books) {
            if (!req.query.classification) { throw [{message: "No matches found."}] }
            for (i = 0; i < classifications.length; i++) {
                if (classifications[i].signum == req.query.classification) {
                    if (classifications[i].books.length == 0) {
                        throw [{message: "Classification empty"}]
                    }
                    else {
                        throw [{message: "No matches found."}]
                    }
                }
            }
        }

        if (req.query.classification) {
            for (let i = 0; i < classifications.length; i++) {
                if (classifications[i].signum == req.query.classification) {
                    classifications[i].isSelected = true
                }
            }
        }

        const pages = (books.count) / limit
        const pagesArray = generatePageNumbers(pages, req.query.currentPage)
        
        const model = {
            pages: pagesArray,
            books: books,
            classifications: classifications,
            currentClassification: req.query.classification,
            searchString: req.query.searchString,
            table: req.baseUrl,
            placeholder: "Search for a title or an ISBN",
        }
        res.render("books/books_list.hbs", model)
    }
    catch (errors) {
        const model = {
            errors: errors,
        }
        if (errors[0].message == "Classification empty") {
            model.signum = req.query.classification
            res.render("books/books_classification_delete.hbs", model)
        }
        else {
            res.render("status_report.hbs", model)
        }
    }
})

router.post("/classificationDelete/:SIGNUM", async function(req, res) {

    const classification = {
        signum: req.params.SIGNUM
    }

    try {
        const successPromise = classificationManager.delete(req.session.authorityId, classification)
        const booksPromise = bookManager.findAll(req.query)
        const classificationsPromise = classificationManager.findAll()

        const wrapper = await Promise.all([successPromise, booksPromise, classificationsPromise])
        const books = wrapper[1]
        const classifications = wrapper[2]

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
        }

        res.render("books/books_list.hbs", model)

    }
    catch (errors) {
        const model = {
            errors: errors,
        }
        res.render("status_report.hbs", model)
    }
})

router.get("/edit/:ISBN", async function(req, res) {
    
    try {
        const bookPromise = bookManager.findByPk({ISBN: req.params.ISBN})
        let classificationsPromise = classificationManager.findAll(req.query)
        
        const wrapper = await Promise.all([bookPromise, classificationsPromise])
        const book = wrapper[0]
        const classifications = wrapper[1]

        for (let i = 0; i < classifications.length; i++) {
            if (classifications[i].signId == book.signId) {
                classifications[i].isCurrent = true
                break
            }
        }
        const model = {
            book: book,
            classifications: classifications,
        }
        res.render("books/book_edit.hbs", model)
    }
    catch (errors) {
        const model = {
            errors: errors,
        }
        res.render("status_report.hbs", model)
    }
})

router.post("/unlinkAuthor", async function(req, res) {

    const bookAuthor = {
        authorId: req.body.authorId,
        bookISBN: req.body.bookISBN
    }

    try {
        const successPromise = bookAuthorManager.delete(req.session.authorityId, bookAuthor)
        const bookPromise = bookManager.findByPk({ISBN: bookAuthor.bookISBN})

        const wrapper = await Promise.all([successPromise, bookPromise])
        const book = wrapper[1]

        const model = {
            book: book,
        }
        res.render("books/book_view.hbs", model)
    }
    catch (errors) {
        const model = {
            errors: errors,
        }
        res.render("status_report.hbs", model)
    }
})

router.post("/edit/:ISBN", async function(req, res) {

    let book = {
        ISBN: req.body.ISBN,
        title: req.body.title,
        pages:req.body.pages,
        publicationInfo:req.body.publicationInfo,
        publicationYear:req.body.publicationYear,
        signId: req.body.classification
    }
    const oldISBN = req.params.ISBN

    try {
        const successPromise = bookManager.update(req.session.authorityId, book, oldISBN)
        const classificationPromise = classificationManager.findByPk({ signId: book.signId })

        const wrapper = await Promise.all([successPromise, classificationPromise])
        book.classification  = wrapper[1]
        
        const model = {
            book: book,
        }
        res.render("books/book_view.hbs", model)
    }
    catch (errors) {
        const model = {
            errors: errors,
        }
        res.render("status_report.hbs", model)
    }
})

// Search for a specific book via ISBN
router.get("/:ISBN", async function (req, res) {

    try {
        const book = await bookManager.findByPk({ISBN: req.params.ISBN})

        const model = {
            book: book,
        }
        res.render("books/book_view.hbs", model)
    }
    catch (errors) {
        const model = {
            errors: errors,
        }
        res.render("status_report.hbs", model)
    }
})




module.exports = router