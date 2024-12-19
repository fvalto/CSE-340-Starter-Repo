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
      res.redirect("/inv/detail/${inv_id}");
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
    let nav = await utilities.getNav()
    const reviews = await reviewModel.getReviewsByAccountId(account_id);
    try {
        res.locals.reviews = reviews;
        res.render('review/edit', {
            title: 'Edit Review',
            nav,
            reviews,
            errors: null,
          });
        next();
    } catch (error) {
        console.error("getReviewsForAccount Error: ", error);
        req.flash("error", "Failed to load your reviews.");
        next();
    }
};

/* ***************************
 * Update a review view
 * ************************** */
async function editReviewView(req, res) {
    try {
        const account_id = res.locals.accountData.account_id;
        const review = await reviewModel.getReviewsByAccountId(account_id);
        const reviewId = review.review_id;
        const reviews = await reviewModel.getReviewById(reviewId);
  
        res.render('review/edit', {
            title: 'Edit Review',
            reviews,
        });
    } catch (error) {
        console.error("Error fetching review:", error);
        req.flash("error", "Error loading the review.");
        res.redirect('/account/account-info');
    }
};


async function editReview(req, res) {
    try {
      const reviewId = req.params.reviewId;
      const { review_text } = req.body;
  
      const result = await reviewModel.updateReview(reviewId, review_text);
  
      if (result) {
        req.flash('success', 'Review updated successfully');
        res.redirect(`/account/account-info`);
      } else {
        req.flash('error', 'Error updating review');
        res.redirect(`/account/account-info`);
      }
    } catch (error) {
      console.error("Error updating review:", error);
      req.flash("error", "Error updating review.");
      res.redirect(`/account/account-info`);
    }
};

/* ***************************
 * Delete a review View
 * ************************** */
async function deleteReviewView(req, res) {
    try {
      const reviewId = req.params.reviewId;
      const review = await reviewModel.getReviewById(reviewId);
  
      res.render('review/delete', {
        title: 'Delete Review',
        review,
      });
    } catch (error) {
      console.error("Error fetching review:", error);
      req.flash("error", "Error loading the review.");
      res.redirect('/account/account-info');
    }
};

/* ***************************
 * Delete review
 * ************************** */
async function deleteReview(req, res) {
    try {
      const reviewId = req.params.reviewId;
      const result = await reviewModel.deleteReview(reviewId);
  
      if (result) {
        req.flash('success', 'Review deleted successfully');
        res.redirect(`/account/account-info`);
      } else {
        req.flash('error', 'Error deleting review');
        res.redirect(`/account/account-info`);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      req.flash("error", "Error deleting review.");
      res.redirect(`/account/account-info`);
    }
};

module.exports = { addReview, getReviewsForInventory, getReviewsForAccount, editReviewView, editReview, deleteReviewView, deleteReview };