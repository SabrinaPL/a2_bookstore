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
  BASE_URL = process.env.BASE_URL || '/'

  /**
   * Initializes the CartController with a new instance of the CartModel.
   */
  constructor () {
    this.#cartModel = new CartModel()
  }

  /**
   * Displays the user's cart with all items.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async index (req, res, next) {
    try {
      if (!req.session.user) {
        req.session.flash = { type: 'danger', text: 'You must be logged in to view your cart.' }
        return res.redirect(`${this.BASE_URL}users/login`)
      }

      const userId = req.session.user.id
      const cartItems = await this.#cartModel.getCart(userId)

      res.render('bookStore/cart', { viewData: { cartItems } })
    } catch (error) {
      next(error)
    }
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
        return res.redirect(`${this.BASE_URL}users/login`)
      }

      const { bookId, quantity } = req.body
      const userId = req.session.user?.id
      const quantityAsInt = parseInt(quantity, 10)

      // For debugging purposes, log the session user and the payload received when adding to cart
      console.log('session user', req.session.user)
      console.log('add-to-cart payload', { userId, bookId, quantity })

      if (!userId) {
        req.session.flash = { type: 'danger', text: 'Your session expired. Please log in again.' }
        return res.redirect(`${this.BASE_URL}users/login`)
      }

      if (!bookId || Number.isNaN(quantityAsInt) || quantityAsInt < 1) {
        req.session.flash = { type: 'danger', text: 'Please choose a valid book and quantity.' }
        return res.redirect(`${this.BASE_URL}books`)
      }

      await this.#cartModel.addToCart(userId, bookId, quantityAsInt)

      req.session.flash = { type: 'success', text: 'The book was added to your cart.' }

      res.redirect(`${this.BASE_URL}books`)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Updates or deletes a book from the user's cart.
   * If quantity is 0, the item is deleted. Otherwise, the quantity is updated.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async update (req, res, next) {
    try {
      if (!req.session.user) {
        req.session.flash = { type: 'danger', text: 'You must be logged in to modify your cart.' }

        return res.redirect(`${this.BASE_URL}users/login`)
      }

      const { bookId, quantity } = req.body
      const userId = req.session.user?.id
      const quantityAsInt = parseInt(quantity, 10)

      if (!userId) {
        req.session.flash = { type: 'danger', text: 'Your session expired. Please log in again.' }
        return res.redirect(`${this.BASE_URL}cart`)
      }

      if (!bookId || Number.isNaN(quantityAsInt) || quantityAsInt < 0) {
        req.session.flash = { type: 'danger', text: 'Invalid quantity specified.' }

        return res.redirect(`${this.BASE_URL}cart`)
      }

      // If quantity is 0, delete the item; otherwise update to the new quantity
      if (quantityAsInt === 0) {
        await this.#cartModel.removeFromCart(userId, bookId)
        req.session.flash = { type: 'success', text: 'Item removed from your cart.' }
      } else {
        await this.#cartModel.updateCart(userId, bookId, quantityAsInt)
        req.session.flash = { type: 'success', text: 'Cart updated successfully.' }
      }

      res.redirect(`${this.BASE_URL}cart`)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Displays the checkout page with order details.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async checkout (req, res, next) {
    try {
      if (!req.session.user) {
        req.session.flash = { type: 'danger', text: 'You must be logged in to checkout.' }
        return res.redirect(`${this.BASE_URL}users/login`)
      }

      const userId = req.session.user.id
      const cartItems = await this.#cartModel.getCart(userId)

      if (!cartItems || cartItems.length === 0) {
        req.session.flash = { type: 'warning', text: 'Your cart is empty.' }
        return res.redirect(`${this.BASE_URL}cart`)
      }

      // Prepare order details with dummy data for now
      const orderData = {
        orderNo: Math.floor(Math.random() * 100000) + 1000,
        customerName: req.session.user.firstName + ' ' + req.session.user.lastName,
        customerAddress: req.session.user.address || 'Address not provided',
        books: cartItems
      }

      res.render('bookStore/orderDetails', { viewData: { order: orderData } })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Clears all items from the user's cart.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async clearCart (req, res, next) {
    try {
      if (!req.session.user) {
        req.session.flash = { type: 'danger', text: 'You must be logged in to clear your cart.' }

        return res.redirect(`${this.BASE_URL}users/login`)
      }

      const userId = req.session.user.id

      await this.#cartModel.clearCart(userId)

      req.session.flash = { type: 'success', text: 'Your cart has been cleared.' }

      res.redirect(`${this.BASE_URL}cart`)
    } catch (error) {
      next(error)
    }
  }
}
