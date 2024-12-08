// Resources Needed
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inv-validation");
const utilities = require("../utilities/index")

//Route to build inventory by classification
router.get("/type/:classificationId", invController.buildByClassificationId);

router.get("/detail/:invId", invController.showInventoryItemDetail);

router.get('/:trigger-error', invController.triggerError);

// Management Links
router.get('/', invController.showManagement);

// Add Clasification
router.get('/add-classification', invController.showAddClassification);

router.post('/add-classification', 
  invValidate.classificationRules(),
  invValidate.checkData,
  invController.addClassification
)

// Add Inventory
router.get("/add-inventory", utilities.handleErrors(invController.showAddInventory));

router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;