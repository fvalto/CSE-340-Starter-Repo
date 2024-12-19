const reviewModel = require("../models/review-model");
const utilities = require("../utilities/index");

/* ***************************
 *  Add new review
 * ************************** */
async function addReview(req, res) {
    try {
        console.log("Form Data!!:", req.body); // Log the form data for debugging
      const { review_text, inv_id, account_id, reviewer_name } = req.body;
      const result = await reviewModel.addReview(review_text, parseInt(inv_id), parseInt(account_id), reviewer_name);
  
      if (result) {
        req.flash('success', 'Review added successfully');
        res.redirect(`/inv/detail/${inv_id}`);
      } else {
        req.flash('error', 'There was an error adding your review');
        res.redirect(`/inv/detail/${inv_id}`);
      }
  
      return res.redirect(`/inv/detail/${inv_id}`);
    } catch (error) {
      console.error("Error adding review:", error);
      req.flash("notice", "An error occurred while adding the review.");
      res.redirect("back");
    }
  };

/* ***************************
 * Display reviews in the inventory detail view
 * ************************** */
async function getReviewsForInventory(req, res) {
    const inv_id = parseInt(req.params.inv_id);
    try {
        const reviews = await reviewModel.getReviewsByInventoryId(inv_id);
        res.locals.reviews = reviews;
        next();
    } catch (error) {
        console.error("getReviewsForInventory Error: ", error);
        req.flash("error", "Failed to load reviews.");
        next();
    }
}

/* ***************************
 * Display reviews in the account management view
 * ************************** */
async function getReviewsForAccount(req, res) {
    const account_id = res.locals.accountData.account_id;
    try {
        const reviews = await reviewModel.getReviewsByAccountId(account_id);
        res.locals.reviews = reviews;
        next();
    } catch (error) {
        console.error("getReviewsForAccount Error: ", error);
        req.flash("error", "Failed to load your reviews.");
        next();
    }
}

/* ***************************
 * Update a review
 * ************************** */
async function updateReview(req, res) {
    const { review_id, review_text } = req.body;
    try {
        const review = await reviewModel.updateReview(review_id, review_text);
        req.flash("notice", "Review updated successfully.");
        res.redirect("/account/account-management");
    } catch (error) {
        console.error("updateReview Error: ", error);
        req.flash("error", "Failed to update review. Please try again.");
        res.redirect("/account/account-management");
    }
}

/* ***************************
 * Delete a review
 * ************************** */
async function deleteReview(req, res) {
    const { review_id } = req.body;
    try {
        const review = await reviewModel.deleteReview(review_id);
        req.flash("notice", "Review deleted successfully.");
        res.redirect("/account/account-management");
    } catch (error) {
        console.error("deleteReview Error: ", error);
        req.flash("error", "Failed to delete review. Please try again.");
        res.redirect("/account/account-management");
    }
}

module.exports = { addReview, getReviewsForInventory, getReviewsForAccount, updateReview, deleteReview };