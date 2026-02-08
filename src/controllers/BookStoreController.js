/**
 * @file Defines the BookStoreController class.
 * @module BookStoreController
 * @author Mats Loock & Sabrina Prichard-Lybeck <sp223kz@student.lnu.se>
 */

import { BookModel } from '../models/BookModel.js'

/**
 * Encapsulates a controller.
 */
export class BookStoreController {
  /**
   * Displays a list of all books.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      // Get search parameters from query string
      const filters = {
        subject: req.query.subject || '',
        author: req.query.author || '',
        title: req.query.title || ''
      }

      // Pagination - default to 5 books per page
      const page = parseInt(req.query.page) || 1
      const perPage = parseInt(req.query.perPage) || 5
      const offset = (page - 1) * perPage

      // Fetch books from database using OFFSET and LIMIT
      const books = await BookModel.search(filters, perPage, offset)
      const totalBooks = await BookModel.count(filters)
      const totalPages = Math.ceil(totalBooks / perPage) || 1

      const viewData = {
        books,
        currentPage: page,
        totalPages,
        perPage,
        filters
      }

      res.render('bookStore/index', { viewData })
    } catch (error) {
      next(error)
    }
  }
}
