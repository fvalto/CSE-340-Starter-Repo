const utilities = require("../utilities/")
const accountModel = require("../models/account-model")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    let form = await utilities.buildLoginForm()
    res.render("account/login", {
      title: "Login",
      nav,
      form,
    })
  }

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  let register = await utilities.buildRegisterForm()
  res.render("account/register", {
    title: "Register",
    nav,
    register,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;
  let form = await utilities.buildLoginForm()

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    const loginForm = await utilities.buildLoginForm();
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      form
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    const registerForm = await utilities.buildRegisterForm();
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      form
    });
  }
}

  
module.exports = { buildLogin, buildRegister, registerAccount }
  