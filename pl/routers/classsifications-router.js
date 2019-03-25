const express = require('express')
const router = express.Router();
const generatePageNumbers = require("../functionality/functionality").generatePageNumbers

const classificationManager = require("../../bll/classifications-manager")


// search for many books that match a string and filters
router.get("/", async function(req, res) {
    
    try {
       
        const classifications = await classificationManager.findAll(req.query)

        const pages = (classifications.count) / req.query.limit
        const pagesArray = generatePageNumbers(pages, req.query.currentPage)
        
        
       
        const model = {
            pages: pagesArray,
            searchString: req.query.searchString,
            table: req.baseUrl,
            placeholder: "Search for a Classification name or Id",
            classifications: classifications,
            currentClassification: req.query.classification,
            session: req.session
        }
        res.render("classifications/classifications_list.hbs", model)
    }
    catch (errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("status_report.hbs", model)
    }
})

// Search for a specific book via ISBN
router.get("/:signId", async function (req, res) {

    try {
        const classification = await classificationManager.findByPk({signId: req.params.signId})

        const model = {
            classification: classification,
            session: req.session
        }
        res.render("classifications/classifications_view.hbs", model)
    }
    catch (errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("status_report.hbs", model)
    }
})


module.exports = router