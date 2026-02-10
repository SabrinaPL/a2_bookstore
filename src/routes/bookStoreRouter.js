/**
 * @file Defines the book store router.
 * @module bookStoreRouter
 * @author Sabrina Prichard-Lybeck <sp223kz@student.lnu.se>
 */

// src/routes/bookStoreRouter.js
import express from 'express'
import { BookStoreController } from '../controllers/BookStoreController.js'
import { CartController } from '../controllers/CartController.js'

export const router = express.Router()

const bookStoreController = new BookStoreController()
const cartController = new CartController()

// Provide req.doc to the route if :id is present in the route path.
// router.param('id', (req, res, next, id) => controller.loadSnippetDocument(req, res, next, id))

// Map HTTP verbs and route paths to controller action methods.
router.get('/', (req, res, next) => bookStoreController.index(req, res, next))
router.post('/cart', (req, res, next) => cartController.add(req, res, next))

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
