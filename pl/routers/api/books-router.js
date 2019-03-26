
const express = require('express')
const router = express.Router();

const bookManager = require("../../../bll/books-manager")
const classificationManager = require("../../../bll/classifications-manager")

const generatePageNumbers = require("../../functionality/functionality").generatePageNumbers

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
            session: req.session
        }
        res.status(200).send(model)
    }
    catch (errors) {
        const model = {
            errors: errors,
            session: req.session
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

module.exports = router
