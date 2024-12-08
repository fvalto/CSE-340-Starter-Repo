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

invCont.showManagement = async function (req, res, next) {
  let nav = await utilities.getNav()

  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null
  })
}

invCont.showAddClassification = async (req, res) => {
  const nav = await utilities.getNav()
  res.render('inventory/add-classification', {
      title: 'Add Classification',
      nav,
      errors: null,
  })
}

invCont.addClassification = async (req, res) => {
  const { classification_name } = req.body;
  const nav = await utilities.getNav()
  try {
    const result = await invModel.addClassification(classification_name);
    if (result) {
      req.flash('notice', 'Classification added successfully.');
      const nav = await utilities.getNav(); // Regenerate navigation
      res.status(201).render('inventory/management', {
        title: 'Vehicle Management',
        nav,
        errors: null,
      });
    } else {
      req.flash('notice', 'Error: Could not add classification.');
      res.status(500).render('inventory/add-classification', {
        title: 'Add Classification',
        nav,
        errors: null,
      });
    }
  } catch (err) {
    console.error('Error adding classification:', err);
    req.flash('notice', 'An unexpected error occurred.');
    res.status(500).render('inventory/add-classification', {
      title: 'Add Classification',
      nav,
      errors: null,
    });
  }
};

invCont.showAddInventory = async (req, res) => {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add Inventory Item",
    nav,
    classificationList,
    errors: null,
  });
};

invCont.addInventory = async (req, res) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_image,
    inv_thumbnail,
  } = req.body;

  try {
    const result = await invModel.addInventory({
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_image,
      inv_thumbnail,
    });

    if (result) {
      req.flash("notice", "Inventory item added successfully.");
      const nav = await utilities.getNav();
      res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
      });
    } else {
      req.flash("notice", "Error adding inventory item.");
      const nav = await utilities.getNav();
      const classificationList = await utilities.buildClassificationList(classification_id);
      res.status(500).render("inventory/add-inventory", {
        title: "Add Inventory Item",
        nav,
        classificationList,
        errors: null,
      });
    }
  } catch (err) {
    console.error("Error adding inventory item:", err);
    req.flash("notice", "An unexpected error occurred.");
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(classification_id);
    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      classificationList,
      errors: null,
    });
  }
};

module.exports = invCont