/**
 * @file Defines the UserController class.
 * @module UserController
 * @author Sabrina Prichard-Lybeck <sp223kz@student.lnu.se>
 */

// I want this controller to handle the logic for user registration and login.
import { UserModel } from '../models/UserModel.js'
// import createHTTPError from 'http-errors'
import validator from 'validator'

/**
 * Encapsulates a controller.
 */
export class UserController {
  BASE_URL = process.env.BASE_URL || '/'

  /**
   * Renders a view and sends the rendered HTML string as an HTTP response.
   * index GET.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  index (req, res, next) {
    res.render('users/login')
  }

  /**
   * Returns a HTML form for registering a new user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async registration (req, res) {
    res.render('users/register')
  }

  // Method for registration
  /**
   * Registers a new user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {*} - Redirects to the login page if the user is successfully registered.
   */
  async createRegistration (req, res, next) {
    try {
      if (!req.body.email || !req.body.password || !req.body.firstName || !req.body.lastName ||
          !req.body.address || !req.body.city || !req.body.zipCode || !req.body.phoneNumber || !req.body.password2) {
        req.session.flash = { type: 'danger', text: 'Please enter all required fields.' }
        return res.redirect(`${this.BASE_URL}users/register`)
      }

      // Sanitize user input to prevent XSS attacks and other security issues.
      const firstName = validator.escape(req.body.firstName)
      const lastName = validator.escape(req.body.lastName)
      const address = validator.escape(req.body.address)
      const city = validator.escape(req.body.city)
      const zipCode = validator.escape(req.body.zipCode)
      const phoneNumber = validator.escape(req.body.phoneNumber)
      const email = validator.escape(req.body.email)
      const password = validator.escape(req.body.password)
      const password2 = validator.escape(req.body.password2)

      if (!validator.isEmail(email)) {
        req.session.flash = { type: 'danger', text: 'Please enter a valid email address.' }
        return res.redirect(`${this.BASE_URL}users/register`)
      }

      if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        req.session.flash = { type: 'danger', text: 'Please enter a stronger password. It should be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols.' }
        return res.redirect(`${this.BASE_URL}users/register`)
      }

      if (!validator.isPostalCode(zipCode, 'any')) {
        req.session.flash = { type: 'danger', text: 'Please enter a valid postal code.' }
        return res.redirect(`${this.BASE_URL}users/register`)
      }

      if (!validator.isMobilePhone(phoneNumber, 'any')) {
        req.session.flash = { type: 'danger', text: 'Please enter a valid phone number.' }
        return res.redirect(`${this.BASE_URL}users/register`)
      }

      if (password !== password2) {
        req.session.flash = { type: 'danger', text: 'Passwords do not match.' }
        return res.redirect(`${this.BASE_URL}users/register`)
      }

      // Check if the email already exists against the stored emails in the database.
      const existingUser = await UserModel.findByEmail(email)

      if (existingUser) {
        req.session.flash = { type: 'danger', text: 'Registration failed. Please check your information and try again.' }
        return res.redirect(`${this.BASE_URL}users/register`)
      }

      // Create the new user
      await UserModel.create({
        email,
        password,
        firstName,
        lastName,
        address,
        city,
        zipCode,
        phoneNumber
      })

      req.session.flash = { type: 'success', text: 'Account created successfully.' }

      res.redirect(`${this.BASE_URL}users/login`)
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect(`${this.BASE_URL}users/register`)
    }
  }

  /**
   * Returns a HTML form for logging in.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async login (req, res, next) {
    try {
      res.render('users/login')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Login the user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {*} - Redirects to the home page if the user is logged in.
   */
  async createLogin (req, res, next) {
    try {
      if (!req.body.email || !req.body.password) {
        req.session.flash = { type: 'danger', text: 'Please enter all required fields.' }
        return res.redirect(`${this.BASE_URL}users/login`)
      }

      const email = validator.escape(req.body.email)
      const password = req.body.password // Don't escape password before comparing

      // Check if the user is already logged in to the session.
      if (!req.session.user) {
        // Authenticate the user
        const user = await UserModel.authenticate(email, password)

        // Session regeneration improves security (ex session fixation attacks and session hijacking).
        req.session.regenerate(() => {
          req.session.flash = { type: 'success', text: 'You are now logged in.' }
          req.session.user = user

          return res.redirect(`${this.BASE_URL}books/`)
        })
      } else {
        req.session.flash = { type: 'danger', text: 'You are already logged in.' }
        return res.redirect('/')
      }
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect(`${this.BASE_URL}users/login`)
    }
  }

  /**
   * Logout the user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {*} - Redirects to the home page if the user is logged out.
   */
  logout (req, res, next) {
    try {
      if (!req.session.user) {
        return res.render('error/404')
      } else {
        req.session.destroy(() => {
          res.redirect(`${this.BASE_URL}`)
        })
      }
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method for user authentication.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {*} - Redirects to 404 page if user is not authenticated.
   */
  static authenticateUser (req, res, next) {
    try {
      if (!req.session.user) {
        req.session.flash = { type: 'danger', text: 'Please log in to continue.' }
        const BASE_URL = process.env.BASE_URL || '/'
        return res.redirect(`${BASE_URL}users/login`)
      } else {
        next()
      }
    } catch (error) {
      next(error)
    }
  }
}
