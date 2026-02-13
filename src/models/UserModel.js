/**
 * @file Defines the User model.
 * @module UserModel
 * @author Sabrina Prichard-Lybeck <sp223kz@student.lnu.se>
 */

import db from '../config/db.js'
import bcrypt from 'bcrypt'

/**
 * User model for handling database operations.
 */
export class UserModel {
  /**
   * Find a user by ID.
   *
   * @param {number} userId - The user ID to search for.
   * @returns {Promise<object|null>} The user object or null if not found.
   * @throws {Error} If database query fails.
   */
  static async findById (userId) {
    try {
      const [members] = await db.query('SELECT * FROM members WHERE userid = ?', [userId])

      return members.length > 0 ? members[0] : null
    } catch (error) {
      throw new Error(`Database error while finding user by ID: ${error.message}`)
    }
  }

  /**
   * Find a user by email.
   *
   * @param {string} email - The email to search for.
   * @returns {Promise<object|null>} The user object or null if not found.
   * @throws {Error} If database query fails.
   */
  static async findByEmail (email) {
    try {
      const [members] = await db.query('SELECT * FROM members WHERE email = ?', [email])

      return members.length > 0 ? members[0] : null
    } catch (error) {
      throw new Error(`Database error while finding user by email: ${error.message}`)
    }
  }

  /**
   * Create a new user in the database.
   *
   * @param {object} userData - The user data.
   * @param {string} userData.email - User email.
   * @param {string} userData.password - User password (will be hashed).
   * @param {string} userData.firstName - User first name.
   * @param {string} userData.lastName - User last name.
   * @param {string} userData.address - User address.
   * @param {string} userData.city - User city.
   * @param {string} userData.zipCode - User zip code.
   * @param {string} userData.phoneNumber - User phone number.
   * @returns {Promise<number>} The ID of the newly created user.
   */
  static async create (userData) {
    try {
      const { email, password, firstName, lastName, address, city, zipCode, phoneNumber } = userData

      // Hash and salt the password before storing
      const hashedPassword = await bcrypt.hash(password, 10)

      // Insert the new member into the database
      const [result] = await db.query(
        'INSERT INTO members (email, password, fname, lname, address, city, zip, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [email, hashedPassword, firstName, lastName, address, city, zipCode, phoneNumber]
      )

      return result.insertId
    } catch (error) {
      // Check for duplicate email error
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email address already exists.')
      }
      throw new Error(`Database error while creating user: ${error.message}`)
    }
  }

  /**
   * Authenticate a user.
   *
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<object>} The user object (without password).
   * @throws {Error} If authentication fails.
   */
  static async authenticate (email, password) {
    try {
      const user = await this.findByEmail(email)

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials.')
      }

      // Return user object without password
      return {
        id: user.userid,
        email: user.email,
        firstName: user.fname,
        lastName: user.lname,
        address: user.address,
        city: user.city,
        zipCode: user.zip,
        phoneNumber: user.phone
      }
    } catch (error) {
      if (error.message === 'Invalid credentials.') {
        throw error
      }
      throw new Error(`Database error during authentication: ${error.message}`)
    }
  }
}
