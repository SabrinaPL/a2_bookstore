import 'dotenv/config'
import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import session from 'express-session'
import logger from 'morgan'
import helmet from 'helmet'
import { sessionOptions } from './config/sessionOptions.js'
import { router } from './routes/router.js'
import { appConfig } from './config/appConfig.js'
import { paths } from './config/paths.js'
import { limiter } from './config/rateLimitOptions.js'

try {
  // Connect to MySQL database.
  const { default: db } = await import('./config/db.js')

  db.getConnection()
    .then(() => console.log('Successfully connected to the MySQL database.'))
    .catch((error) => {
      console.error('Unable to connect to the MySQL database:', error)
      process.exit(1)
    })

  // Creates an Express application.
  const app = express()

  // Set various HTTP headers to help protect the application from well-known web vulnerabilities.
  app.use(helmet())

  // Apply the rate limiting middleware to login and register routes.
  app.use('/login', limiter)
  app.use('/register', limiter)

  // Set up a morgan logger using the dev format for log entries. Record system events.
  app.use(logger('dev'))

  // View engine setup.
  app.set('view engine', 'ejs')
  app.set('views', paths.viewsDir)
  app.set('layout', paths.layoutsDir)
  app.set('layout extractScripts', true)
  app.set('layout extractStyles', true)
  app.use(expressLayouts)

  // Parse requests of the content type application/x-www-form-urlencoded.
  // Populates the request object with a body object (req.body).
  app.use(express.urlencoded({ extended: false }))

  // Serve static files.
  app.use(express.static(paths.publicDir))

  // Setup and use session middleware (https://github.com/expressjs/session)
  if (appConfig.isProduction) {
    app.set('trust proxy', 1) // trust first proxy
  }
  // Will handle the session cookie.
  app.use(session(sessionOptions))

  // Middleware to be executed before the routes.
  app.use((req, res, next) => {
    // Flash messages - survives only a round trip.
    if (req.session.flash) {
      res.locals.flash = req.session.flash
      delete req.session.flash
    }

    // Pass the base URL to the views.
    res.locals.baseURL = appConfig.baseURL
    // Pass the user to the views.
    res.locals.user = req.session.user || null

    next()
  })

  app.use('/', router)

  // Error handler.
  app.use((err, req, res, next) => {
    console.error(err)

    // 404 Not Found.
    if (err.status === 404) {
      res
        .status(404)
        .sendFile(paths.errors404File)
      return
    }

    // 403 Forbidden.
    if (err.status === 403) {
      res
        .status(403)
        .sendFile(paths.errors403File)
      return
    }

    // 500 Internal Server Error (in production, all other errors send this response).
    if (appConfig.isProduction) {
      res
        .status(500)
        .sendFile(paths.errors500File)
      return
    }

    // ---------------------------------------------------
    // ⚠️ WARNING: Development Environment Only!
    //             Detailed error information is provided.
    // ---------------------------------------------------

    // Render the error page.
    res
      .status(err.status || 500)
      .render('errors/error', { error: err })
  })

  // Starts the HTTP server listening for connections.
  const server = app.listen(appConfig.port, () => {
    console.log(`Server running at http://localhost:${server.address().port}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (err) {
  console.error(err)
  process.exitCode = 1
}
