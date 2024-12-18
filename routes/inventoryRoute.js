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
router.get(
  '/add-classification',
  utilities.checkAccountType,
  invController.showAddClassification

);

router.post('/add-classification', 
  invValidate.classificationRules(),
  invValidate.checkData,
  utilities.checkAccountType,
  invController.addClassification
)

// Add Inventory
router.get(
  "/add-inventory",
  utilities.checkAccountType,
  utilities.handleErrors(invController.showAddInventory)
);

router.post(
  "/add-inventory",
  utilities.handleErrors(invValidate.inventoryRules()),
  invValidate.checkInventoryData,
  utilities.checkAccountType,
  utilities.handleErrors(invController.addInventory)
);

router.get(
  "/getInventory/:classification_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get(
  "/edit/:inv_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.editInventoryView)
);

router.post(
  "/edit-inventory/",
  utilities.checkAccountType,
  utilities.handleErrors(invController.updateInventory)
)

router.get(
  "/delete/:inv_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventoryView)
);

router.post(
  "/delete-inventory/",
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventory)
)

module.exports = router;