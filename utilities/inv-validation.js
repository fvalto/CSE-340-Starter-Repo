const { body, validationResult } = require("express-validator")
const utilities = require("../utilities/index")
const invValidate = {}
const invModel = require("../models/inventory-model")

/* ******************************
 *  Classification Data Validation Rules
 * ****************************** */
invValidate.classificationRules = () => {
    return [
      body('classification_name')
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage('Please provide a valid classification name.')
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage('Classification name cannot contain spaces or special characters.')
    ]
  }

/* ******************************
 *  Check data and return errors or continue
 * ****************************** */
invValidate.checkData = async (req, res, next) => {
    const { classification_name } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const nav = await utilities.getNav()
      res.render('inventory/add-classification', {
        title: "Add Classification",
        nav,
        errors,
        classification_name
      })
      return
    }
    next()
  }

  invValidate.inventoryRules = () => {
    return [
      body("classification_id").notEmpty().withMessage("Classification is required."),
      body("inv_make").notEmpty().withMessage("Make is required."),
      body("inv_model").notEmpty().withMessage("Model is required."),
      body("inv_year")
        .isNumeric()
        .withMessage("Year must be numeric.")
        .isInt({ min: 1900, max: 2100 })
        .withMessage("Year must be between 1900 and 2100."),
      body("inv_description").notEmpty().withMessage("Description is required."),
      body("inv_price").isNumeric().withMessage("Price must be numeric."),
      body("inv_miles").isNumeric().withMessage("Miles must be numeric."),
      body("inv_image").notEmpty().withMessage("Image path is required."),
      body("inv_thumbnail").notEmpty().withMessage("Thumbnail path is required."),
    ];
  };
  
  /* ******************************
   *  Check Inventory Data
   * ****************************** */
  invValidate.checkInventoryData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const classificationList = await utilities.buildClassificationList(req.body.classification_id);
      const nav = await utilities.getNav();
      return res.status(400).render("inventory/add-inventory", {
        title: "Add Inventory Item",
        nav,
        classificationList,
        errors,
        ...req.body,
      });
    }
    next();
  };

    /* ******************************
   *  Errors will be directed back to the edit view
   * ****************************** */
    invValidate.checkUpdateData = async (req, res, next) => {
      const errors = validationResult(req);
      const inv_id = parseInt(req.params.inv_id)
      const itemData = await invModel.getCarDetails(inv_id)
      const itemName = `${itemData.inv_make} ${itemData.inv_model}`
      if (!errors.isEmpty()) {
        const classificationList = await utilities.buildClassificationList(req.body.classification_id);
        const nav = await utilities.getNav();
        return res.status(400).render("inventory/edit-inventory", {
          title: "Edit " + itemName,
          nav,
          classificationList,
          errors,
          inv_id,
          ...req.body,
        });
      }
      next();
    };

  module.exports = invValidate;