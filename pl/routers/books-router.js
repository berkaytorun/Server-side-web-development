const express = require('express')
const router = express.Router();

const bll = require("../../bll/books-manager")


function generatePageNumbers(totalPages, currentPage) {
    currentPage = Number(currentPage)

    totalPages = Math.ceil(totalPages)

    const pagesArray = []
    const pagination = {}
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

    let hasFirstPage = start == firstPage
    

    if (!hasFirstPage) {
        pagination.hasFirstPage = true
    }
    for (let i = start; i <= end; i++) {
        if (i == currentPage) {
            pagesArray.push({value: i, isCurrent: true})
        }
        else {
            pagesArray.push({value: i, isCurrent: false})
        }
    }
    
    let hasLastPage = end == lastPage
    if (!hasLastPage) {
        pagination.hasLastPage = true
    }
    
    pagination.pages = pagesArray

    return pagination
}


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
        const pages = (books.total) / req.query.limit
        books.pages = generatePageNumbers(pages, req.query.currentPage)
        books.searchString = req.query.searchString

        const model = {
            pagination: books.pages,
            books: books
        }
        res.render("books/books_list.hbs", model)
    }).catch(function(error) {
        res.render("error.hbs", error)
    })
})


router.get("/search", function(req, res) {
    res.render("books/books_search.hbs")
})

// Search for a specific book via ISBN
router.get("/:ISBN", function (req, res) {
    req.query.ISBN = req.params.ISBN
    bll.getBookInfo(req)
    .then(function(bookInfo) {
        res.render("books/book_view.hbs", bookInfo)
    }).catch(function(error) {
        res.render("error.hbs", error)
    })
})



module.exports = router