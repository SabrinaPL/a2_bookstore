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
  async search (filters, limit, offset) {
    let query = 'SELECT * FROM books'
    const params = []

    // Add filters to query if provided
    const conditions = []

    if (filters.subject) {
      conditions.push('LOWER(subject) LIKE LOWER(?)')
      params.push(`%${filters.subject}%`)
    }

    // Author: Search by first name prefix (case-insensitive)
    if (filters.author) {
      conditions.push("LOWER(SUBSTRING_INDEX(author, ' ', 1)) LIKE LOWER(?)")
      params.push(`${filters.author}%`)
    }

    // Title: Search for titles containing the entered word (case-insensitive)
    if (filters.title) {
      conditions.push('LOWER(title) LIKE LOWER(?)')
      params.push(`%${filters.title}%`)
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    // Add LIMIT and OFFSET for pagination
    query += ' LIMIT ? OFFSET ?'
    params.push(limit, offset)

    try {
      const [books] = await db.query(query, params)

      return books
    } catch (error) {
      throw new Error(`Database error while searching books: ${error.message}`)
    }
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
  async count (filters) {
    let query = 'SELECT COUNT(*) as total FROM books'
    const params = []

    // Add filters to query if provided
    const conditions = []

    if (filters.subject) {
      conditions.push('LOWER(subject) LIKE LOWER(?)')
      params.push(`%${filters.subject}%`)
    }

    // Author: Search by first name prefix (case-insensitive)
    if (filters.author) {
      conditions.push("LOWER(SUBSTRING_INDEX(author, ' ', 1)) LIKE LOWER(?)")
      params.push(`${filters.author}%`)
    }

    // Title: Search for titles containing the entered word (case-insensitive)
    if (filters.title) {
      conditions.push('LOWER(title) LIKE LOWER(?)')
      params.push(`%${filters.title}%`)
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    try {
      const [result] = await db.execute(query, params)

      return result[0].total
    } catch (error) {
      throw new Error(`Database error while counting books: ${error.message}`)
    }
  }
}
