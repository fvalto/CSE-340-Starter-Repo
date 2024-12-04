const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}
const detailCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build details by classification view
 * ************************** */
invCont.showInventoryItemDetail = async function (req, res, next) {
  const invId = req.params.invId
  const data = await invModel.getCarDetails(invId)
  const div = await utilities.buildCarCard(data)
  let nav = await utilities.getNav()
  const carYear = data.inv_year
  const carMake = data.inv_make
  const carModel = data.inv_model

  res.render("./inventory/carDetails", {
    title: `${carYear} ${carMake} ${carModel}`,
    nav,
    div,
    errors: null
  })
}

invCont.triggerError = (req, res, next) => {
  try {
    throw new Error('This is an intentional error for testing!');
  } catch (err) {
    next(err); 
  }
};

module.exports = invCont