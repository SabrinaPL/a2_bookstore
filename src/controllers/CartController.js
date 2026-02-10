/**
 * @file Defines the CartController class.
 * @module CartController
 * @author Sabrina Prichard-Lybeck <sp223kz@student.lnu.se>
 */

import { CartModel } from '../models/CartModel.js'

/**
 * CartController class to manage cart operations.
 */
export class CartController {
  #cartModel

  /**
   * Initializes the CartController with a new instance of the CartModel.
   */
  constructor () {
    this.#cartModel = new CartModel()
  }

  /**
   * Adds a book to the user's shopping cart.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async add (req, res, next) {
    try {
      if (!req.session.user) {
        req.session.flash = { type: 'danger', text: 'You must be logged in to add items to your cart.' }
        return res.redirect('/users/login')
      }

      const { bookId, quantity } = req.body
      const userId = req.session.user?.id
      const quantityAsInt = parseInt(quantity, 10)

      // For debugging purposes, log the session user and the payload received when adding to cart
      console.log('session user', req.session.user)
      console.log('add-to-cart payload', { userId, bookId, quantity })

      if (!userId) {
        req.session.flash = { type: 'danger', text: 'Your session expired. Please log in again.' }
        return res.redirect('/users/login')
      }

      if (!bookId || Number.isNaN(quantityAsInt) || quantityAsInt < 1) {
        req.session.flash = { type: 'danger', text: 'Please choose a valid book and quantity.' }
        return res.redirect('/books')
      }

      await this.#cartModel.addToCart(userId, bookId, quantityAsInt)

      req.session.flash = { type: 'success', text: 'The book was added to your cart.' }

      res.redirect('/books')
    } catch (error) {
      next(error)
    }
  }
}
