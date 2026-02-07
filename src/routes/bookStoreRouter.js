/**
 * @file Defines the snippet router.
 * @module snippetRouter
 * @author Mats Loock & Sabrina Prichard-Lybeck <sp223kz@student.lnu.se>
 */
// src/routes/snippetRouter.js
import express from 'express'
import { BookStoreController } from '../controllers/BookStoreController.js'
// import { UserController } from '../controllers/UserController.js'

export const router = express.Router()

const controller = new BookStoreController()

// TODO: create a book store controller

// Provide req.doc to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => controller.loadSnippetDocument(req, res, next, id))

// Map HTTP verbs and route paths to controller action methods.
router.get('/', (req, res, next) => controller.index(req, res, next))

// Route for creating new snippets should only be available for authenticated users.
// Code pattern as recommended by Mats.
router.route('/create')
  // .all(
  //   UserController.authenticateUser
  // )
  .get((req, res, next) => controller.create(req, res, next))
  .post((req, res, next) => controller.createPost(req, res, next))

// Route for updating snippets should only be available for authenticated and authorized users.
router.route('/:id/update')
  // .all(
  //   [UserController.authenticateUser, UserController.authorizeUser]
  // )
  .get((req, res, next) => controller.update(req, res, next))
  .post((req, res, next) => controller.updatePost(req, res, next))

// Route for deleting snippets should only be available for authenticated and authorized users.
router.route('/:id/delete')
  // .all(
  //   [UserController.authenticateUser, UserController.authorizeUser]
  // )
  .get((req, res, next) => controller.delete(req, res, next))
  .post((req, res, next) => controller.deletePost(req, res, next))
