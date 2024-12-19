const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities/index");

// Route to add a new review
router.post(
    "/add",
    utilities.checkJWTToken,
    utilities.handleErrors(reviewController.addReview)
);

// Route to update an existing review
router.post(
    "/update",
    utilities.checkJWTToken,
    utilities.handleErrors(reviewController.updateReview)
);

// Route to delete a review
router.post(
    "/delete",
    utilities.checkJWTToken,
    utilities.handleErrors(reviewController.deleteReview)
);

module.exports = router;