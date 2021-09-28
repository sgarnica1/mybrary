if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const port = 3000
const bodyParser = require('body-parser') // Form submissions

// ROUTES
const indexRouter = require('./routes/index')
const authorsRouter = require('./routes/authors')
const booksRouter = require('./routes/books')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views/')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public')) // CSS Files
app.use(bodyParser.urlencoded({limit: '10mb', extended: false})) // Form submissions


// DATA BASE 
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL) 
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Conneceted to Mongoose'))


app.use('/', indexRouter)
app.use('/authors', authorsRouter)
app.use('/books', booksRouter)


app.listen(process.env.PORT || port, () => {
  console.log('App running on port 3000')
})