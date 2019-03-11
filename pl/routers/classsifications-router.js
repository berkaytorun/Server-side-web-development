const express = require('express')
const router = express.Router();

const classificationManager = require("../../bll/classifications-manager")


// search for many books that match a string and filters
router.get("/", async function(req, res) {
    
    try {
       
        const classifications = classificationManager.findAll()
        
       
        const model = {
           
            classifications: classifications,
            currentClassification: req.query.classification,
            session: req.session
        }
        res.render("books/books_list.hbs", model)
    }
    catch (errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("status_report.hbs", model)
    }
})