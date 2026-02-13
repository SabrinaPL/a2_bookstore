/**
 * @file Defines the book store router.
 * @module bookStoreRouter
 * @author Sabrina Prichard-Lybeck <sp223kz@student.lnu.se>
 */

// src/routes/bookStoreRouter.js
import express from 'express'
import { BookController } from '../controllers/BookController.js'
import { CartController } from '../controllers/CartController.js'
import { UserController } from '../controllers/UserController.js'
// import { OrderController } from '../controllers/OrderController.js'

export const router = express.Router()

const bookController = new BookController()
const cartController = new CartController()

// Route for listing all books in the store
router.get('/', (req, res, next) => bookController.index(req, res, next))

// Cart routes for adding, updating, and deleting items in the cart, for clearing the cart, and for checking out
router.route('/cart')
  .all(UserController.authenticateUser)
  .get((req, res, next) => cartController.index(req, res, next))
  .post((req, res, next) => cartController.add(req, res, next))

router.route('/cart/update')
  .all(UserController.authenticateUser)
  .get((req, res, next) => cartController.update(req, res, next))
  .post((req, res, next) => cartController.update(req, res, next))

router.get('/cart/clear', UserController.authenticateUser, (req, res, next) => cartController.clearCart(req, res, next))

router.get('/checkout', UserController.authenticateUser, (req, res, next) => cartController.checkout(req, res, next))

// TODO: add routes for listing user order and order details at checkout, and for confirming the order and showing the order confirmation page
