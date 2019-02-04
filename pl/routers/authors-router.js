
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
    res.render("authors/authors_create.hbs")
})



module.exports = router
