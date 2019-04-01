const express = require('express')
const router = express.Router();
const generatePageNumbers = require("../functionality/functionality").generatePageNumbers

const classificationManager = require("../../bll/classifications-manager")
const bookManager = require("../../bll/books-manager")


// search for many Classification that match a string
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
        }
        res.render("classifications/classifications_list.hbs", model)
    }
    catch (errors) {
        const model = {
            errors: errors,
        }
        res.render("status_report.hbs", model)
    }
})
router.get("/create", function(req, res) {
    res.render("classifications/classifications_create.hbs")
})

router.post("/create", async function(req, res) {
        
    const classification = {
        signId: req.params.SIGNID,
        signum: req.body.signum,
        description: req.body.description
    }

    try {
        const largestId = await classificationManager.findHighestPk(req.session.authorityId, classification)
        classification.signId = largestId + 1
        await classificationManager.create(req.session.authorityId, classification)


        const model = {
            classification: classification,
        }
        res.render("classifications/classifications_view.hbs", model)
    }
    catch (errors) {
        const model = {
            errors: errors,
        }
        res.render("status_report.hbs", model)
    }
})


router.get("/edit/:SIGNID", async function(req, res) {

    let classification = {
        signId: req.params.SIGNID
    }
    
    try {
        classification = await classificationManager.findByPk(classification)

        const model = {
            classification: classification,
        }
        res.render("classifications/classifications_edit.hbs", model)
    }
    catch (errors) {
        const model = {
            errors: errors,
        }
        res.render("status_report.hbs", model)
    }
})

router.post("/edit/:SIGNID", async function(req, res) {

    let classification = {
        signId: req.params.SIGNID,
        signum: req.body.signum,
        description: req.body.description
    }

    try {
        let wrapper = await Promise.all([
            classificationManager.editByPk(req.session.authorityId, classification) ,
            classificationManager.findAll(req.query)
        ])
          
        for (let i = 0, element = wrapper[1]; i < element.length; i++){
            if (element[i].signId == classification.signId) {
                element[i].signum =  classification.signum
                element[i].description = classification.description
                break
            }
        }
        const pages = (wrapper[1].count) / req.query.limit
        const pagesArray = generatePageNumbers(pages, req.query.currentPage)
        

        const model = {
            pages: pagesArray,
            searchString: req.query.searchString,
            table: req.baseUrl,
            placeholder: "Search for a Classification name or Id",
            classifications: wrapper[1],
        }
        res.render("classifications/classifications_list.hbs", model)
    }
    catch (errors) {
        const model = {
            errors: errors,
        }
        res.render("status_report.hbs", model)
    }
})

router.post("/delete/:SIGNID", async function(req, res) {

    let classification = {
        signId: req.params.SIGNID
    }

    try {

        const wrapper = await Promise.all([
            classificationManager.findByPk(classification),
            bookManager.findBooksByClassification(classification)
        ])

        classification = wrapper[0]
        const books = wrapper[1]
        
        if (!classification) {
            throw [{message: "Classification does not exist."}]
        }
        if (books.length > 0) {
            throw [{message: "Classification is not empty. It can not be deleted"}]
        }

        await classificationManager.delete(req.session.authorityId, classification)
        
        const model = {
            errors: [{message: "Classification " + classification.signum + " deleted."}],
        }

        res.render("status_report.hbs", model)

    }
    catch (errors) {
        const model = {
            errors: errors,
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
        }
        res.render("classifications/classifications_view.hbs", model)
    }
    catch (errors) {
        const model = {
            errors: errors,
        }
        res.render("status_report.hbs", model)
    }
})



module.exports = router