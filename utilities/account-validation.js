const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const accountModel = require("../models/account-model")
  const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),


    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),


    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (emailExists){
        throw new Error("Email exists. Please log in or use different email")
      }
    }),
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

validate.inventoryRules = () => {
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

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(req.body.classification_id);
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

module.exports = validate