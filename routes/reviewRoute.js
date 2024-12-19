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

// Route for editing a review
router.get('/edit/:reviewId', reviewController.editReviewView);
router.post('/edit-review', reviewController.editReview);

// Route for deleting a review
router.get('/delete/:reviewId', reviewController.deleteReviewView);
router.post('/delete-review', reviewController.deleteReview);

module.exports = router;