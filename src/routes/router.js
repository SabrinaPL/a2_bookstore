/**
 * @file Defines the router class.
 * @module router
 * @author Mats Loock & Sabrina Prichard-Lybeck <sp223kz@student.lnu.se>
 */

import express from 'express'
import http from 'node:http'
import { router as homeRouter } from './homeRouter.js'
import { router as bookStoreRouter } from './bookStoreRouter.js'
import { router as userRouter } from './userRouter.js'

export const router = express.Router()

// Router object is used as argument.
router.use('/', homeRouter)
router.use('/books/', bookStoreRouter)
router.use('/users/', userRouter)

// Catch 404 and forward to error handler.
router.use('*', (req, res, next) => {
  const statusCode = 404
  const error = new Error(http.STATUS_CODES[statusCode])
  error.status = statusCode
  next(error)
})
