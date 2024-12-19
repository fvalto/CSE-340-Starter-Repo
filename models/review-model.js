const pool = require("../database/")

/* ***************************
 *  Add review
 * ************************** */
async function addReview(reviewText, invId, accountId, reviewerName) {
    try {
      const result = await pool.query(`
        INSERT INTO public.review (review_text, review_date, inv_id, account_id, reviewer_name)
        VALUES ($1, DEFAULT, $2, $3, $4)`, 
        [reviewText, invId, accountId, reviewerName]
    );
      return result.rows[0];
    } catch (error) {
      console.error("Error in addReview:", error);
      return null;
    }
  };

/* ***************************
 *  Get review for vehicle by invId
 * ************************** */
async function getReviewsByInventoryId(invId) {
    try {
        const sql = `
            SELECT r.review_id, r.review_text, r.review_date, r.reviewer_name, a.account_firstname, a.account_lastname
            FROM public.review r
            JOIN public.account a ON r.account_id = a.account_id
            WHERE r.inv_id = $1
            ORDER BY r.review_date DESC;`;
        const data = await pool.query(sql, [invId]);
        return data.rows;
    } catch (error) {
        console.error("getReviewsByInventoryId Error: ", error);
        throw new Error("Database Error: Unable to fetch reviews");
    }
}

/* ***************************
 *  Get all reviews written by accountId (for accoun management view)
 * ************************** */
async function getReviewsByAccountId(accountId) {
    try {
        const sql = `
            SELECT account_id, review_id, reviewer_name, review_text, review_date
            FROM public.review
            WHERE account_id = $1`;
        const data = await pool.query(sql, [accountId]);
        return data.rows;
    } catch (error) {
        console.error("getReviewsByAccountId Error: ", error);
        throw new Error("Database Error: Unable to fetch reviews");
    }
}

/* ***************************
 *  Get all reviews written by accountId (for accoun management view)
 * ************************** */
async function getReviewById(review_id) {
    try {
        const sql = `
            SELECT account_id, review_id, reviewer_name, review_text, review_date
            FROM public.review
            WHERE review_id = $1`;
        const data = await pool.query(sql, [review_id]);
        return data.rows;
    } catch (error) {
        console.error("getReviewsByAccountId Error: ", error);
        throw new Error("Database Error: Unable to fetch reviews");
    }
}

/* ***************************
 *  Update a review
 * ************************** */
async function updateReview(reviewId, reviewText) {
    try {
        const sql = `
            UPDATE public.review
            SET review_text = $1, review_date = now()
            WHERE review_id = $2 RETURNING *;`;
        const data = await pool.query(sql, [reviewText, reviewId]);
        return data.rows[0];
    } catch (error) {
        console.error("updateReview Error: ", error);
        throw new Error("Database Error: Unable to update review");
    }
}

/* ***************************
 *  Delete review by reviewId
 * ************************** */
async function deleteReview(reviewId) {
    try {
        const sql = `
            DELETE FROM public.review
            WHERE review_id = $1 RETURNING *;`;
        const data = await pool.query(sql, [reviewId]);
        return data.rows[0];
    } catch (error) {
        console.error("deleteReview Error: ", error);
        throw new Error("Database Error: Unable to delete review");
    }
}

module.exports = { addReview, getReviewsByInventoryId, getReviewsByAccountId, updateReview, deleteReview, getReviewById };