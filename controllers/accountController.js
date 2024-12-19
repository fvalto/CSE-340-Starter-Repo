const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const reviewModel = require("../models/review-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
*  Deliver Management view
* *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      req.session.account_id = accountData.account_id
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      res.status(200).render("account/loggedIn", {
        title: "Welcome",
        nav,
        errors: null,
      })
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}
  
async function manageAccountView(req, res) {
  try {
    let nav = await utilities.getNav();
    const { accountData } = res.locals;

    if (!accountData) {
      req.flash("notice", "Account not found. Please log in again.");
      return res.redirect("/account/login");
    }

    res.render("account/account-management", {
      title: "Manage Account",
      nav,
      errors: null,
      firstName: accountData.firstName,
      lastName: accountData.lastName,
      email: accountData.account_email,
    });
  } catch (error) {
    console.error("Error rendering account management view:", error);
    req.flash("notice", "An unexpected error occurred.");
    return res.redirect("/account/login");
  }
};

const logout = (req, res) => {
  res.clearCookie('jwt');
  req.flash('notice', 'You have successfully logged out.');
  res.redirect('/');
};

async function getUserReviews(req, res) {
  try {
    const accountId = req.session.account_id;
    const reviews = await reviewModel.getReviewsByAccountId(accountId);
    let nav = await utilities.getNav()

    res.render('account/account-info', {
      title: 'Account Information',
      nav,
      reviews,
      errors: null,
    });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    req.flash("error", "Error loading your reviews.");
    res.redirect('/account/account-info');
  }
};

module.exports = { buildLogin, buildRegister, registerAccount, buildManagement, accountLogin, manageAccountView, logout, getUserReviews }
  