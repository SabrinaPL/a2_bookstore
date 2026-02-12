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
   * Method to get the contents of the cart for a specific user, including book details.
   *
   * @param {*} userId - The ID of the user whose cart is being retrieved.
   * @returns {Promise<Array>} - A promise that resolves to an array of cart items with book details.
   */
  async getCart (userId) {
    const [cartItems] = await db.execute(
      `SELECT cart.userid, cart.isbn, cart.qty, books.title, books.price
       FROM cart 
       JOIN books ON cart.isbn = books.isbn
       WHERE cart.userid = ?`,
      [userId]
    )
    return cartItems
  }

  /**
   * Method to update the quantity of a book in the cart.
   *
   * @param {*} userId - The ID of the user.
   * @param {*} bookId - The ISBN of the book.
   * @param {*} quantity - The new quantity for the book.
   * @returns {Promise} - A promise that resolves when the cart is updated.
   */
  async updateCart (userId, bookId, quantity) {
    const [result] = await db.execute(
      'UPDATE cart SET qty = ? WHERE userid = ? AND isbn = ?',
      [quantity, userId, bookId]
    )
    return result
  }

  /**
   * Method to remove a book from the cart.
   *
   * @param {*} userId - The ID of the user.
   * @param {*} bookId - The ISBN of the book to remove.
   * @returns {Promise} - A promise that resolves when the book is removed from the cart.
   */
  async removeFromCart (userId, bookId) {
    const [result] = await db.execute(
      'DELETE FROM cart WHERE userid = ? AND isbn = ?',
      [userId, bookId]
    )
    return result
  }

  /**
   * Method to delete a specific quantity of a book from the cart.
   * If the quantity to delete is >= current quantity, the item is removed entirely.
   * Otherwise, the quantity is decreased by the specified amount.
   *
   * @param {*} userId - The ID of the user.
   * @param {*} bookId - The ISBN of the book.
   * @param {*} quantity - The quantity to delete.
   * @returns {Promise} - A promise that resolves when the operation is complete.
   */
  async deleteFromCart (userId, bookId, quantity) {
    const [rows] = await db.execute(
      'SELECT qty FROM cart WHERE userid = ? AND isbn = ?',
      [userId, bookId]
    )

    if (rows.length === 0) {
      throw new Error('Item not found in cart')
    }

    const currentQuantity = rows[0].qty

    if (quantity >= currentQuantity) {
      // Remove the entire item if quantity to delete is >= current quantity
      return this.removeFromCart(userId, bookId)
    } else {
      // Update the quantity by subtracting the specified amount
      const newQuantity = currentQuantity - quantity
      return this.updateCart(userId, bookId, newQuantity)
    }
  }
}

// TODO: add logic for adding books to the cart and viewing the cart

// TODO: add books to cart for logged in user
// TODO: view cart for logged in user
// TODO: update cart for logged in user
// TODO: remove books from cart for logged in user
// TODO: add error handling for cart operations
