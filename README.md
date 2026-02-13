# Online Bookstore Application (A2 - 1DV503, Linneaus University)

A server-side-rendered (SSR) web application for an online bookstore built with Node.js, Express, and MySQL. Users can register, search for books, add items to a shopping cart, and place orders.

---

## Features

### User Management
- **Registration** - Create new user accounts with email validation and strong password requirements
- **Login** - Secure authentication with bcrypt password hashing
- **Logout** - End session and return to home page
- **Session Management** - Persistent user sessions with CSRF protection

### Book Browsing
- **Search Books** - Filter books by:
  - Subject (exact match)
  - Author (first name prefix, case-insensitive)
  - Title (partial match, case-insensitive)
- **Pagination** - Browse through results with configurable items per page (2, 3, 5, 10, 20)
- **Book Details** - View title, author, ISBN, subject, and price for each book

### Shopping Cart
- **Add to Cart** - Add books with custom quantities
- **Duplicate Prevention** - Adding an existing book updates quantity instead of creating duplicate
- **Update Quantity** - Modify item quantities or delete by setting quantity to 0
- **Clear Cart** - Remove all items with confirmation
- **Cart Summary** - View total price calculation in real-time

### Order Management
- **Checkout** - Create orders with automatic order number generation
- **Shipping Address** - Uses user's registered address from database
- **Order Invoice** - Display detailed invoice with:
  - Order date (automatically set with `NOW()`)
  - Calculated delivery date (7 days after order)
  - Shipping address
  - Book details and subtotals
  - Order total
- **Persistent Storage** - Orders and order details saved to database

### Security
- **SQL Injection Prevention** - Parameterized queries with placeholders
- **XSS Protection** - Input sanitization and output escaping
- **CSRF Protection** - Token validation on all POST requests
- **Password Security** - bcrypt hashing with strength validation
- **Rate Limiting** - 100 requests per 15 minutes on login/register routes
- **Security Headers** - Helmet middleware for HTTP security headers
- **Session Security** - HttpOnly, SameSite=strict, Secure in production

### Error Handling
- **Try/Catch** - Error handling in all controllers and models
- **Database Error Handling** - SQL errors caught and logged
- **Centralized Error Handler** - Routes all errors through Express error middleware
- **User-Friendly Messages** - Flash messages for expected errors
- **Development/Production Modes** - Detailed errors in dev, generic in production

---

### Get started

1. Create an .env-file (the .env.example file is provided as a template) with your actual database credentials and session secret.
2. Run `npm install` to install dependencies.
3. Run `npm start` to start the server.

---

## Authors

- Sabrina Prichard-Lybeck <sp223kz@student.lnu.se>
- Mats Loock (teacher and author of the Just Task It-template from the course 1DV026)