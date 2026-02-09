/**
 * @file Defines the homeRouter class.
 * @module homeRouter
 * @author Mats Loock (from the Just Task It-template in the course 1DV026)
 */

import express from 'express'
import { HomeController } from '../controllers/HomeController.js'

export const router = express.Router()

const controller = new HomeController()

// GET
router.get('/', (req, res, next) => controller.index(req, res, next))

// POST
router.post('/', (req, res, next) => controller.indexPost(req, res, next))
