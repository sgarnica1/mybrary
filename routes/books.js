const { render } = require('ejs')
const express = require('express')
const router = express.Router()
const multer = require('multer') // Create files into system, get the filename and store it into database
const path = require('path')
const fs = require('fs') // Delete coverImageName when created on error 
const Author = require('../models/author')
const Book = require('../models/book')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

// All Books Route
router.get('/', async (req, res) => {
  let query = Book.find()
  let searchOptions = {}
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
    console.log(query)
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore) // Less than or equal to
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter) // Greater than or equal to
  }
  try {
    const books = await query.exec()
    res.render('books/index', {
      books: books,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})


// New Book Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Book())
})

// Create Book Route
router.post('/', upload.single('cover'), async (req, res) => {
  console.log(req.file)
  const fileName = req.file != null ? req.file.filename : null
  console.log(fileName)
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    pageCount: req.body.pageCount,
    publishDate: new Date (req.body.publishDate),
    coverImageName: fileName,
    description: req.body.description
  })  

  try {
    const newBook = await book.save()
    res.redirect('books')
  } catch(error){
    if(book.coverImageName != null) {
      removeBookCover(book.coverImageName)
    }
    renderNewPage(res, book, true)
    console.log(error)
  }
})


function removeBookCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if(err) console.error(err)
    console.log(`${fileName} was successfully deleted`)
  })
}

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      book: book
    }
    if (hasError) params.errorMessage = 'Error creating book'
    res.render('books/new', params) 
  } catch(error) {
    res.redirect('/books')
    console.log(error)
  }
}

module.exports = router