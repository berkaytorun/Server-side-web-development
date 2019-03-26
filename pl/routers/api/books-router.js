
const express = require('express')
const router = express.Router();
const fs = require('fs');

const bookManager = require("../../../bll/books-manager")
const classificationManager = require("../../../bll/classifications-manager")

const generatePageNumbers = require("../../functionality/functionality").generatePageNumbers

// search for many books that match a string and filters


router.get("/file/search",  function(req, res) {
    const filePath = "C:\\Users\\tobe18ut\\Desktop\\public\\server-side-project\\pl\\views\\partials\\search.hbs"

    res.render(filePath)
    //res.status(200).send(model)
    
})
router.get("/file/css",  function(req, res) {

    
  var options = {
    root: __dirname + '/public/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  var fileName = "css/style.css";
  res.sendFile(fileName, options, function (err) {
 
      console.log('Sent:', fileName);
    
  });
    
})

router.get("/file/js",  function(req, res) {

    
    var options = {
      root: __dirname + '/public/',
      dotfiles: 'deny',
      headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
      }
    };
  
    var fileName = "js/api.js";
    res.sendFile(fileName, options, function (err) {
   
        console.log('Sent:', fileName);
      
    });
      
  })

router.get("/search", async function(req, res) {
    
    try {
        const books = await bookManager.findAll(req.query)
        
        const pages = (books.count) / req.query.limit
        const pagesArray = generatePageNumbers(pages, req.query.currentPage)
        
        const model = {
            pages: pagesArray,
            books: books,
            searchString: req.query.searchString,
            table: req.baseUrl,
            placeholder: "Search for a title or an ISBN",
            session: req.session
        }
        res.status(200).send(model)
    }
    catch (errors) {

        res.status(404).send(errors)

    }
})



router.get("/", async function(req, res) {
    
    try {
        const books = await bookManager.findAll(req.query)
        
        const pages = (books.count) / req.query.limit
        const pagesArray = generatePageNumbers(pages, req.query.currentPage)
        
        const model = {
            pages: pagesArray,
            books: books,
            searchString: req.query.searchString,
            table: req.baseUrl,
            placeholder: "Search for a title or an ISBN",
            session: req.session
        }
        res.status(200).json(model)
    }
    catch (errors) {

        res.status(404).send(errors)

    }
})

module.exports = router
