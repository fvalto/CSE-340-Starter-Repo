const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    };    
}

/* ***************************
 *  Get all details  by classification_id
 * ************************** */
async function getCarDetails(invId) {
    try {
      const data = await pool.query(
        `SELECT i.inv_id, i.inv_make, i.inv_model, i.inv_year, i.inv_description, i.inv_image, i.inv_thumbnail, i.inv_price, i.inv_miles, i.inv_color, c.classification_name
        FROM public.inventory AS i
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.inv_id = $1`, 
        [invId]
      );
      return data.rows[0];
    } catch (error) {
      console.error("getCarDetails error: " + error);
    }
  }


  async function addClassification(classification_name) {
    try {
      const sql = `
        INSERT INTO classification (classification_name)
        VALUES ($1)
        RETURNING classification_id`;
      const data = await pool.query(sql, [classification_name]);
      return data.rowCount;
    } catch (error) {
      console.error("Error inserting classification:", error);
      return null;
    }
  }

  async function addInventory(data) {
    try {
      const sql = `
        INSERT INTO inventory (
          classification_id,
          inv_make,
          inv_model,
          inv_year,
          inv_description,
          inv_price,
          inv_miles,
          inv_image,
          inv_thumbnail
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING inv_id;
      `;
      const result = await pool.query(sql, [
        data.classification_id,
        data.inv_make,
        data.inv_model,
        data.inv_year,
        data.inv_description,
        data.inv_price,
        data.inv_miles,
        data.inv_image,
        data.inv_thumbnail,
      ]);
      return result.rowCount;
    } catch (err) {
      console.error("Database error:", err);
      return null;
    }
  }
  
module.exports = {getClassifications, getInventoryByClassificationId, getCarDetails, addClassification, addInventory}