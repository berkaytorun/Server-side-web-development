
const express = require('express')
const router = express.Router();

const authorManager = require("../../bll/authors-manager")
const bookAuthorManager = require("../../bll/book-authors-manager")
const bookManager = require("../../bll/books-manager")

const generatePageNumbers = require("../functionality/functionality").generatePageNumbers

router.get("/", async function(req, res) {

    try {
        const authors = await authorManager.findAll(req.query)

        const pages = (authors.count) / req.query.limit
        const pagesArray = generatePageNumbers(pages, req.query.currentPage)

        const model = {
            pages: pagesArray,
            authors: authors,
            searchString: req.query.searchString,
            table: req.baseUrl,
            placeholder:"Search for a Name of Author",
            session: req.session
        }
        res.render("authors/authors_list.hbs", model)
    } catch (errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("status_report.hbs", model)
    }
})

router.get("/create", function(req, res) {
    const model = {
        session: req.session
    }
    res.render("authors/author_create.hbs", model)
})

router.post("/create", async function(req, res) {
    
    try {
        const author = {
            firstName: req.body.firstName,
            lastName:req.body.lastName,
            birthYear:req.body.birthYear,
        }
        
        const newAuthor = await authorManager.create(req.session.authorityId, author)

        const model = {
            author: newAuthor,
            session: req.session
        }
        res.render("authors/author_view.hbs", model)

    } catch (errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("status_report.hbs", model)
    }
})

router.post("/addBook", async function(req, res) {
    
    try {
        const bookAuthor = {
            bookISBN: req.body.bookISBN,
            authorId: req.body.authorId,
        }

        const bookAuthorPromise = bookAuthorManager.create(req.session.authorityId, bookAuthor)
        const authorPromise = authorManager.findOne({Id: bookAuthor.authorId})
        const bookPromise = bookManager.findByPk({ISBN: bookAuthor.bookISBN})

        const wrapper = await Promise.all([bookAuthorPromise, authorPromise, bookPromise])

        const author = wrapper[1]
        const book = wrapper[2]

        author.books.push(book)

        const model = {
            author: author,
            session: req.session
        }
        res.render("authors/author_view.hbs", model)

    } catch (errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("status_report.hbs", model)        
    }
})


router.get("/edit/:Id", async function(req, res) {

    try {
        const author = await authorManager.findOne({Id: req.params.Id})
        const model = {
            author: author,
            session: req.session
        }
        res.render("authors/author_edit.hbs", model)

    } catch (errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("status_report.hbs", model)
    }
})

router.post("/edit/:Id", async function(req, res) {

    try {
        
        const author = {
            Id: req.params.Id,
            firstName:  req.body.firstName,
            lastName:   req.body.lastName,
            birthYear:  req.body.birthYear,
        }

        const updatePromise = authorManager.update(req.session.authorityId, author)
        const authorPromise = authorManager.findOne(author)

        const wrapper = await Promise.all([updatePromise, authorPromise])
        const newAuthor = wrapper[1]
        
        const model = {
            author: newAuthor,
            session: req.session
        }
        res.render("authors/author_view.hbs", model)

    } catch (errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("status_report.hbs", model)
    }
})

// Search for a specific Author via ID
router.get("/:Id", async function (req, res) {

    try {
            
        const author = await authorManager.findOne({Id: req.params.Id})
        
        const model = {
            author: author,
            session: req.session
        }
        res.render("authors/author_view.hbs", model)
        
    } catch (errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("status_report.hbs", model)
    }
})


router.post("/delete/:Id", async function(req, res) {

    try {
        
        await authorManager.delete(req.session.authorityId, {Id: req.params.Id})
    
        const errors = [
            {message: "Author was removed"}
        ]

        const model = {
            errors: errors,
            session: req.session
        }

        res.render("status_report.hbs", model)

    } catch (errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("status_report.hbs", model)
    }
})



module.exports = router
