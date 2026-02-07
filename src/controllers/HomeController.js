/**
 * @file Defines the HomeController class.
 * @module HomeController
 * @author Mats Loock
 */

import { format } from 'date-fns'

/**
 * Encapsulates a controller.
 */
export class HomeController {
  /**
   * Renders a view and sends the rendered HTML string as an HTTP response.
   * index GET.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  index (req, res, next) {
    res.render('home/index')
  }

  /**
   * Renders a view, based on posted data, and sends the rendered HTML string as an HTTP response.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  indexPost (req, res, next) {
    // Data prepared to be sent to the view.
    const viewData = {
      name: req.body.name,
      // Date formatting (day).
      dayName: format(new Date(), 'iiii'),
      user: req.user
    }

    // Here we need to specify which view shall be rendered (and potential data to be included).
    res.render('home/index', { viewData })
  }
}
