/**
 * @file Defines the Book model.
 * @module BookModel
 * @author Sabrina Prichard-Lybeck <sp223kz@student.lnu.se>
 */

import db from '../config/db.js'

/**
 * Book model for handling database operations.
 */
export class BookModel {
  /**
   * Search for books with filters and pagination.
   *
   * @param {object} filters - Search filters.
   * @param {string} filters.subject - Subject to filter by.
   * @param {string} filters.author - Author to search for.
   * @param {string} filters.title - Title to search for.
   * @param {number} limit - Number of books per page.
   * @param {number} offset - Number of books to skip.
   * @returns {Promise<Array>} Array of book objects.
   */
  static async search (filters, limit, offset) {
    let query = 'SELECT * FROM books WHERE 1=1'
    const params = []

    // Add filters to query if provided
    if (filters.subject) {
      query += ' AND LOWER(subject) LIKE LOWER(?)'
      params.push(`%${filters.subject}%`)
    }

    // Author: Search by first name starting with entered string (case-insensitive)
    if (filters.author) {
      query += ' AND LOWER(author) LIKE LOWER(?)'
      params.push(`${filters.author}%`)
    }

    // Title: Search for titles containing the entered word (case-insensitive)
    if (filters.title) {
      query += ' AND LOWER(title) LIKE LOWER(?)'
      params.push(`%${filters.title}%`)
    }

    // Add LIMIT and OFFSET for pagination
    query += ' LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const [books] = await db.query(query, params)
    return books
  }

  /**
   * Count total books matching the filters.
   *
   * @param {object} filters - Search filters.
   * @param {string} filters.subject - Subject to filter by.
   * @param {string} filters.author - Author to search for.
   * @param {string} filters.title - Title to search for.
   * @returns {Promise<number>} Total count of matching books.
   */
  static async count (filters) {
    let query = 'SELECT COUNT(*) as total FROM books WHERE 1=1'
    const params = []

    // Add filters to query if provided
    if (filters.subject) {
      query += ' AND LOWER(subject) LIKE LOWER(?)'
      params.push(`%${filters.subject}%`)
    }

    // Author: Search by first name starting with entered string (case-insensitive)
    if (filters.author) {
      query += ' AND LOWER(author) LIKE LOWER(?)'
      params.push(`${filters.author}%`)
    }

    // Title: Search for titles containing the entered word (case-insensitive)
    if (filters.title) {
      query += ' AND LOWER(title) LIKE LOWER(?)'
      params.push(`%${filters.title}%`)
    }

    const [result] = await db.query(query, params)
    return result[0].total
  }
}
