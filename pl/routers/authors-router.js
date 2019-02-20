
const express = require('express')
const router = express.Router();

const bll = require("../../bll/authors-manager")

const generatePageNumbers = require("../functionality/functionality").generatePageNumbers

router.get("/", function(req, res) {
    bll.searchAuthors(req)
    .then(function(authors) {
        const pages = (authors.count) / req.query.limit
        const pagesArray = generatePageNumbers(pages, req.query.currentPage)

        const model = {
            pages: pagesArray,
            authors: authors,
            searchString: req.query.searchString,
            table: req.baseUrl,
            placeholder:"search authorneame",
            session: req.session
        }
        res.render("authors/authors_list.hbs", model)
    }).catch(function(error) {
        res.render("error.hbs", error)
    })
})

router.get("/create", function(req, res) {
    res.render("authors/author_create.hbs")
})

router.post("/create", function(req, res) {
    
    bll.createAuthor(req)
    .then(function(author) {
        res.render("authors/author_view.hbs", author)
    }).catch(function(errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("error.hbs", model)
    })
})


router.get("/edit/:Id", function(req, res) {
    req.query.Id = req.params.Id
    bll.getAuthorInfo(req)
    .then(function(authorInfo) {
        res.render("authors/author_edit.hbs", authorInfo)
    }).catch(function(error) {
        res.render("error.hbs", error)
    })
})

router.post("/edit/:Id", function(req, res) {
    req.query.Id = req.params.Id
    bll.editAuthorInfo(req)
    .then(function(authorInfo) {
        bll.getAuthorInfo(req)
        .then(function(authorInfo) {
            res.render("authors/author_edit.hbs", authorInfo)
        }).catch(function(error) {
            res.render("error.hbs", error)
        })
    }).catch(function(error) {
        res.render("error.hbs", error)
    })
})

// Search for a specific Author via ID
router.get("/:Id", function (req, res) {
    req.query.Id = req.params.Id
    bll.getAuthorInfo(req)
    .then(function(authorInfo) {
        const model = {
            authors: authorInfo,
            session: req.session
        }
        res.render("authors/author_view.hbs", model)
    }).catch(function(error) {
        res.render("error.hbs", error)
    })
})


router.post("/delete/:Id", function(req, res) {
    
    req.query.Id = req.params.Id
    bll.authorDelete(req)
    .then(function() {
        const message = {
            errors: [
                {message: "Author was removed"}
            ]
        }
        res.render("error.hbs", message)
    }).catch(function(error) {
        res.render("error.hbs", error)
    })
})




module.exports = router
