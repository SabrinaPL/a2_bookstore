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

// Provide req.doc to the route if :id is present in the route path.
// router.param('id', (req, res, next, id) => controller.loadSnippetDocument(req, res, next, id))

// Route for listing all books in the store
router.get('/', (req, res, next) => bookController.index(req, res, next))

// Cart routes for adding, updating, and deleting items in the cart
router.route('/cart')
  .all(UserController.authenticateUser)
  .get((req, res, next) => cartController.index(req, res, next))
  .post((req, res, next) => cartController.add(req, res, next))
  .put((req, res, next) => cartController.update(req, res, next))
  .delete((req, res, next) => cartController.delete(req, res, next))

// Route for creating new snippets should only be available for authenticated users.
// Code pattern as recommended by Mats.
// router.route('/create')
//   // .all(
//   //   UserController.authenticateUser
//   // )
//   .get((req, res, next) => controller.create(req, res, next))
//   .post((req, res, next) => controller.createPost(req, res, next))

// Route for updating snippets should only be available for authenticated and authorized users.
// router.route('/:id/update')
//   // .all(
//   //   [UserController.authenticateUser, UserController.authorizeUser]
//   // )
//   .get((req, res, next) => controller.update(req, res, next))
//   .post((req, res, next) => controller.updatePost(req, res, next))

// Route for deleting snippets should only be available for authenticated and authorized users.
// router.route('/:id/delete')
//   // .all(
//   //   [UserController.authenticateUser, UserController.authorizeUser]
//   // )
//   .get((req, res, next) => controller.delete(req, res, next))
//   .post((req, res, next) => controller.deletePost(req, res, next))
