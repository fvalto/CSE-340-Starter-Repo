// Resources Needed
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation');

// Login Route
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Register Route
router.get("/register", utilities.handleErrors(accountController.buildRegister))


// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.get(
  "/account-management",
  utilities.handleErrors(accountController.manageAccountView)
);

// Logout
router.get(
  '/logout',
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.logout)
);

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

module.exports = router;