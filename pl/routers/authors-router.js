
const express = require('express')
const router = express.Router();

const bll = require("../../bll/books-manager")


router.get("/", function(req, res) {
    res.render("books/book_create.hbs")
})
router.get("/create", function(req, res) {
    res.render("books/book_create.hbs")
})



module.exports = router
