const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the car HTML card
* ************************************ */
Util.buildCarCard = async function(data) {
  let carCard

  if (data) {
    carCard = '<div id="car-details">'
    carCard += `<img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model}" class="car-image">`
    carCard += `<h2>${data.inv_make} ${data.inv_model} Details</h2>`
    carCard += '<div class="car-info">'
    carCard += `<p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(data.inv_price)}</p>`
    carCard += `<p><strong>Year:</strong> ${data.inv_year}</p>`
    carCard += `<p><strong>Color:</strong> ${data.inv_color}</p>`
    carCard += `<p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(data.inv_miles)} miles</p>`
    carCard += `<p><strong>Description:</strong> ${data.inv_description}</p>`
    carCard += '</div>'
    carCard += '</div>'

  } else {
    // In case the vehicle details are not found
    carCard += '<p class="notice">Sorry, no vehicle details could be found.</p>'
  }
  return carCard
}

/* **************************************
* Build the Login
* ************************************ */
Util.buildLoginForm = async function () {
  let loginForm = "";

  loginForm += '<form action="/account/login" method="POST">';
  loginForm += `<div class="form">`;
  loginForm += `<label for="email">Email Address<input type="email" name="email" id="email" required placeholder="Enter your email"></label>`;
  loginForm += `<label for="password">Password<input type="password" name="password" id="password" required placeholder="Enter your password"></label>`;
  loginForm += `<button type="submit" class="submit-btn">Login</button>`;
  loginForm += `</div>`;
  loginForm += `</form>`;
  loginForm += `<p>Don't have an account? <a href="/account/register">Register here</a></p>`;

  return loginForm;
};

/* **************************************
* Build the Register
* ************************************ */
Util.buildRegisterForm = async function () {
  let registerForm = "";

  registerForm += '<form id="registerForm" action="/account/register" method="post">';
  registerForm += `<div class="form">`;
  registerForm += `<label for="account_firstname">First Name<input type="text" name="account_firstname" id="account_firstname" required placeholder="Enter your first name"></label>`;
  registerForm += `<label for="account_lastname">Last Name<input type="text" name="account_lastname" id="account_lastname" required placeholder="Enter your last name"></label>`;
  registerForm += `<label for="account_email">Email Address<input type="email" name="account_email" id="account_email" required placeholder="Enter your email"></label>`;
  registerForm += `<label for="account_password">Password<input type="password" name="account_password" id="account_password" required pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$" placeholder="Enter a strong password">`;
  registerForm += `<span>Passwords must be at least 12 characters and contain at least 1 number, 1 capital letter and 1 special character</span></label>`;
  registerForm += `<button type="submit" class="submit-btn">Register</button>`;
  registerForm += `</div>`;
  registerForm += `</form>`;

  return registerForm;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util