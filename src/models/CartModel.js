/**
 * @file Defines the Cart model.
 * @module CartModel
 * @author Sabrina Prichard-Lybeck <sp223kz@student.lnu.se>
 */

import db from '../config/db.js'

/**
 * Cart model for handling database operations related to the shopping cart.
 */
export class CartModel {
  /**
   * Method to add a book to the cart. If the book is already in the cart, it updates the quantity.
   *
   * @param {*} userId - The ID of the user adding the book to the cart.
   * @param {*} bookId - The ISBN of the book being added to the cart.
   * @param {*} quantity - The quantity of the book to add to the cart.
   * @returns {Promise} - A promise that resolves when the book is added or updated in the cart.
   */
  async addToCart (userId, bookId, quantity) {
    const [rows] = await db.execute('SELECT * FROM cart WHERE userid = ? AND isbn = ?', [userId, bookId])

    if (rows.length > 0) {
      // If the book is already in the cart, update the quantity
      const newQuantity = rows[0].qty + quantity

      return this.updateCart(userId, bookId, newQuantity)
    } else {
      const [result] = await db.execute('INSERT INTO cart (userid, isbn, qty) VALUES (?, ?, ?)', [userId, bookId, quantity])

      return result
    }
  }

  /**
   * Method to get the contents of the cart for a specific user.
   *
   * @param {*} userId - The ID of the user whose cart is being retrieved.
   * @returns {Promise<Array>} - A promise that resolves to an array of cart items.
   */
  async getCart (userId) {
    const [cartItems] = await db.execute(
      // TODO: add SQL query to get cart items for the user, including books details (so tables need to be joined)
    )
    return cartItems
  }

    async updateCart(userId, bookId, quantity) {
    }

    async removeFromCart(userId, bookId) {
    }
}

// TODO: add logic for adding books to the cart and viewing the cart

// TODO: add books to cart for logged in user
// TODO: view cart for logged in user
// TODO: update cart for logged in user
// TODO: remove books from cart for logged in user
// TODO: add error handling for cart operations
