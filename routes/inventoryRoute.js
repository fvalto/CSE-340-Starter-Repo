// Resources Needed
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

//Route to build inventory by classification
router.get("/type/:classificationId", invController.buildByClassificationId);

router.get("/detail/:invId", invController.showInventoryItemDetail);

router.get('/:trigger-error', invController.triggerError);

module.exports = router;