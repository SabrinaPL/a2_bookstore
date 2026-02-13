/**
 * @file Defines the CartController class.
 * @module CartController
 * @author Sabrina Prichard-Lybeck <sp223kz@student.lnu.se>
 */

import { CartModel } from '../models/CartModel.js'
import { OrderModel } from '../models/OrderModel.js'
import { UserModel } from '../models/UserModel.js'

/**
 * CartController class to manage cart operations.
 */
export class CartController {
  #cartModel
  #orderModel
  BASE_URL = process.env.BASE_URL || '/'

  /**
   * Initializes the CartController with a new instance of the CartModel and OrderModel.
   */
  constructor () {
    this.#cartModel = new CartModel()
    this.#orderModel = new OrderModel()
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
   * Displays the checkout page and creates an order with order details.
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

      // Fetch user data from database for accurate shipping address
      const user = await UserModel.findById(userId)

      if (!user) {
        req.session.flash = { type: 'danger', text: 'User account not found. Please update your profile.' }

        return res.redirect(`${this.BASE_URL}users/profile`)
      }

      // Create the order with shipping details from user's registered address
      const shippingAddress = {
        shipAddress: user.address || 'N/A',
        shipCity: user.city || 'N/A',
        shipZip: user.zip || null
      }

      const orderNo = await this.#orderModel.createOrder(userId, shippingAddress)

      // Create order details for each book in the cart
      await this.#orderModel.createOrderDetails(orderNo, cartItems)

      // Clear the user's cart after successful order
      await this.#cartModel.clearCart(userId)

      // Get the complete order details to display
      const orderDetails = await this.#orderModel.getOrderDetails(orderNo)

      // Calculate delivery date (one week from order date)
      const orderDate = new Date(orderDetails.order.created)
      const deliveryDate = new Date(orderDate)
      deliveryDate.setDate(deliveryDate.getDate() + 7)

      // Prepare order data for the view
      const orderData = {
        orderNo: orderDetails.order.ono,
        orderDate: orderDate.toLocaleDateString(),
        deliveryDate: deliveryDate.toLocaleDateString(),
        customerName: `${orderDetails.order.fname} ${orderDetails.order.lname}`,
        customerAddress: `${orderDetails.order.shipAddress}, ${orderDetails.order.shipCity}, ${orderDetails.order.shipZip}`,
        books: orderDetails.books
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
