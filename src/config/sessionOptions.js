/**
 * @file This module contains the options object for the session middleware.
 * @module sessionOptions
 * @author Mats Loock (from the Just Task It-template in the course 1DV026)
 * @see {@link https://github.com/expressjs/session}
 */

// Options object for the session middleware.
export const sessionOptions = {
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false, // Resave even if a request is not changing the session.
  saveUninitialized: false, // Don't save a created but not modified session.
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: 'strict' // Mitigates the risk of CSRF attacks.
  }
}

if (process.env.NODE_ENV === 'production') {
  sessionOptions.cookie.secure = true
}
