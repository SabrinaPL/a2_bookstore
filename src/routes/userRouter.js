/**
 * @file Defines the user router.
 * @module userRouter
 * @author Sabrina Prichard-Lybeck <sp223kz@student.lnu.se>
 */

// Routes for user registration and login.
import express from 'express'
import { UserController } from '../controllers/UserController.js'

export const router = express.Router()

const controller = new UserController()

// Map HTTP verbs and route paths to controller action methods.
router.get('/', (req, res, next) => {
  controller.index(req, res, () => {
    res.render('layouts/default', { user: req.session.user || null })
  })
})

router.get('/register', (req, res, next) => {
  controller.registration(req, res, () => {
    res.render('layouts/default', { user: req.session.user || null })
  })
})
router.post('/register', (req, res, next) => controller.createRegistration(req, res, next))

router.get('/login', (req, res, next) => {
  controller.login(req, res, () => {
    res.render('layouts/default', { user: req.session.user || null })
  })
})

router.post('/login', (req, res, next) => { controller.createLogin(req, res, next) })

// Route for logging out.
router.route('/logout')
  .all(
    UserController.authenticateUser
  )
  .get((req, res, next) => controller.logout(req, res, next))
  .post((req, res, next) => controller.logoutPost(req, res, next))
