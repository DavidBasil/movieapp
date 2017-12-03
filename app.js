var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var session = require('express-session')
var passport = require('passport')
var config = require('./config/database')

mongoose.connect(config.database)
var db = mongoose.connection

// check connection
db.once('open', function(){
	console.log('Connected to the database')
})

// check for db errors
db.on('error', function(err){
	console.log(err)
})

var app = express()

// article model
var Article = require('./models/article')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// public folder
app.use(express.static(path.join(__dirname, 'public')))

// views
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// sessions
app.use(session({
	secret: 'my secret',
	resave: true,
	saveUninitialized: true
}))

// passport
require('./config/passport')(passport)
app.use(passport.initialize())
app.use(passport.session())

app.get('*', function(req, res, next){
	res.locals.user = req.user || null
	next()
})

// get homepage
app.get('/', function(req, res){
	Article.find({}, function(err, articles){
		if(err){
			console.log(err)
		} else {
			res.render('index', {
				"title": "title",
				"articles": articles
			})
		}
	})
})

// route files
var articles = require('./routes/articles')
var users = require('./routes/users')
app.use('/articles', articles)
app.use('/users', users)


app.listen(3000, function(){
	console.log('Server running on port 3000...')
})
