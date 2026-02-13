/**
 * @file Defines the Order model.
 * @module OrderModel
 * @author Sabrina Prichard-Lybeck <sp223kz@student.lnu.se>
 */
import db from '../config/db.js'

/**
 * OrderModel class to manage order-related database operations.
 */
export class OrderModel {
  /**
   * Creates a new order in the database with shipping details.
   *
   * @param {*} userId - The ID of the user placing the order.
   * @param {*} shippingAddress - Object containing shipAddress, shipCity, shipZip.
   * @returns {Promise} - A promise that resolves to the order number (ono).
   */
  async createOrder (userId, shippingAddress) {
    const { shipAddress, shipCity, shipZip } = shippingAddress

    try {
      const [result] = await db.execute(
        'INSERT INTO orders (userid, created, shipAddress, shipCity, shipZip) VALUES (?, NOW(), ?, ?, ?)',
        [userId, shipAddress, shipCity, shipZip]
      )

      return result.insertId
    } catch (error) {
      throw new Error(`Database error while creating order: ${error.message}`)
    }
  }

  /**
   * Creates order detail entries for each book in the order.
   *
   * @param {*} orderNo - The order number (ono).
   * @param {*} books - Array of book objects with isbn, qty, and price.
   * @returns {Promise} - A promise that resolves when all details are inserted.
   */
  async createOrderDetails (orderNo, books) {
    try {
      const queries = books.map(book => {
        const amount = book.qty * book.price

        return db.execute(
          'INSERT INTO odetails (ono, isbn, qty, amount) VALUES (?, ?, ?, ?)',
          [orderNo, book.isbn, book.qty, amount]
        )
      })

      await Promise.all(queries)
    } catch (error) {
      throw new Error(`Database error while creating order details: ${error.message}`)
    }
  }

  /**
   * Retrieves order details including order info and books.
   *
   * @param {*} orderNo - The order number (ono).
   * @returns {Promise<object>} - A promise that resolves to the order details.
   */
  async getOrderDetails (orderNo) {
    try {
      // Get order information
      const [orderRows] = await db.execute(
        `SELECT 
          orders.ono, 
          orders.userid, 
          orders.created, 
          orders.shipAddress, 
          orders.shipCity, 
          orders.shipZip, 
          members.fname, 
          members.lname 
        FROM orders 
        JOIN members ON orders.userid = members.userid 
        WHERE orders.ono = ?`,
        [orderNo]
      )

      if (orderRows.length === 0) {
        return null
      }

      // Get order details with book information
      const [detailRows] = await db.execute(
        `SELECT 
          odetails.isbn, 
          odetails.qty, 
          odetails.amount, 
          books.title, 
          books.price 
        FROM odetails 
        JOIN books ON odetails.isbn = books.isbn 
        WHERE odetails.ono = ?`,
        [orderNo]
      )

      return {
        order: orderRows[0],
        books: detailRows
      }
    } catch (error) {
      throw new Error(`Database error while retrieving order details: ${error.message}`)
    }
  }
}
