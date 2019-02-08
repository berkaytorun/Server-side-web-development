
const express = require('express')
const router = express.Router();

const bll = require("../../bll/authors-manager")


function generatePageNumbers(totalPages, currentPage) {
    currentPage = Number(currentPage)

    totalPages = Math.ceil(totalPages)

    const pagination = {
        pageList: []
    }
    const pagesClip = 5

    const firstPage = 1 
    const lastPage = totalPages
    
    let start = currentPage <= pagesClip ? firstPage : currentPage - pagesClip
    let end = currentPage <= pagesClip ? (pagesClip * 2) + 1 : currentPage + pagesClip 
    if (end > lastPage) {
        end = lastPage
        start = end - (pagesClip * 2)
        start = start < 1? 1 : start
    }

    pagination.firstPage = start != firstPage ? firstPage : false
    
    for (let i = start; i <= end; i++) {
        if (i == currentPage) {
            pagination.pageList.push({value: i, isCurrent: true})
        }
        else {
            pagination.pageList.push({value: i, isCurrent: false})
        }
    }
    
    pagination.lastPage = end != lastPage ? lastPage : false

    return pagination
}



router.get("/", function(req, res) {
    bll.searchAuthors(req)
    .then(function(authors) {
        const pages = (authors.total) / req.query.limit
        const pagesArray = generatePageNumbers(pages, req.query.currentPage)

        const model = {
            pages: pagesArray,
            authors: authors,
            searchString: req.query.searchString
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
            errors: errors
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
        res.render("authors/author_view.hbs", authorInfo)
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
