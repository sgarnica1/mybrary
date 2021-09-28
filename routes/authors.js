const express = require('express')
const router = express.Router()
const Author = require('../models/author')


// All Authors Route
router.get('/', async (req, res) => {
  let query = Author.find()
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    query = query.regex('name', new RegExp(req.query.name, 'i'))
  }
  // if (req.query.name != null && req.query.name !== '') {
  //   searchOptions.name = new RegExp(req.query.name, 'i')
  // }
  
  try {
    // const authors = await Author.find(searchOptions)
    const authors = await query.exec()
    res.render('authors/index', {
      authors: authors,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})


// New Author Form Route 
router.get('/new', (req, res) => {
  res.render('authors/new', { author: new Author() })
})


// Create New Author
router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name
  })

  try {
    const newAuthor = await author.save()
    // res.redirect(`authors/${newAuthor.id}`)
    res.redirect(`authors`)
  } catch {
    res.render('authors/new', {
      author: author,
      errorMessage: 'Error creating author'
    })
  }
})


module.exports = router