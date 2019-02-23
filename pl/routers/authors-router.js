
const express = require('express')
const router = express.Router();

const bll = require("../../bll/authors-manager")

const generatePageNumbers = require("../functionality/functionality").generatePageNumbers

router.get("/", function(req, res) {

    bll.findAll(req.query)
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
    }).catch(function(errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("error.hbs", model)
    })
})

router.get("/create", function(req, res) {
    const model = {
        session: req.session
    }
    res.render("authors/author_create.hbs", model)
})

router.post("/create", function(req, res) {
    
    const author = {
        firstName: req.body.firstName,
        lastName:req.body.lastName,
        birthYear:req.body.birthYear,
    }

    bll.create(req.session.authorityId, author)
    .then(function(author) {
        const model = {
            author: author,
            session: req.session
        }
        res.render("authors/author_view.hbs", model)
    }).catch(function(errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("error.hbs", model)
    })
})


router.get("/edit/:Id", function(req, res) {
    const author = {
        Id: req.params.Id
    }
    bll.findOne(author)
    .then(function(authorInfo) {
        const model = {
            author: author,
            session: req.session
        }
        res.render("authors/author_edit.hbs", model)
    }).catch(function(errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("error.hbs", model)
    })
})

router.post("/edit/:Id", function(req, res) {
    const author = {
        Id: req.params.Id,
        firstName:  req.body.firstName,
        lastName:   req.body.lastName,
        birthYear:  req.body.birthYear,
    }
    bll.update(req.session.authorityId, author)
    .then(function() {
        const author = {
            Id: req.params.Id,
        }
        return bll.findOne(author)
    }).then(function(authorInfo) {
        const model = {
            author: authorInfo,
            session: req.session
        }
        res.render("authors/author_view.hbs", model)
    }).catch(function(errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("error.hbs", model)
    })
})

// Search for a specific Author via ID
router.get("/:Id", function (req, res) {
    const author = {
        Id: req.params.Id
    }
    bll.findOne(author)
    .then(function(authorInfo) {
        const model = {
            author: authorInfo,
            session: req.session
        }
        res.render("authors/author_view.hbs", model)
    }).catch(function(errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("error.hbs", model)
    })
})


router.post("/delete/:Id", function(req, res) {
    
    const author = {
        Id: req.params.Id
    } 
    bll.delete(req.session.authorityId, author)
    .then(function() {
        const message = {
            errors: [
                {message: "Author was removed"}
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




module.exports = router
