/**
 * @file Defines the Book model.
 * @module BookModel
 * @author Sabrina Prichard-Lybeck <sp223kz@student.lnu.se>
 */

// TODO: create a book model

import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

// Create a schema.
const snippetSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  user: {
    // Creates a reference to the User model, this means that only registered users can create snippets.
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

snippetSchema.add(BASE_SCHEMA)

// Create a model using the schema.
export const SnippetModel = mongoose.model('Snippet', snippetSchema)
