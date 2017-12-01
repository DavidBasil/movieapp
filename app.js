var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var expressValidator = require('express-validator')
var flash = require('connect-flash')
var session = require('express-session')

mongoose.connect('mongodb://localhost/movieapp')
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
	resave: false,
	saveUninitialized: true,
	cookie: { secure: true }
}))

// messages
app.use(require('connect-flash')())
app.use(function(req, res, next){
	res.locals.messages = require('epxress-messages')(req, res)
	next()
})

// validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.'),
			root = namespace.shift()
			formParam = root
		while(namespace.length){
			formParam += '[' + namespace.shift() + ']'
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		}
	}
}))

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

// get article page
app.get('/articles/add', function(req, res){
	res.render('add-article', {
		"title": "Add Article"
	})	
})

// get a single article
app.get('/article/:id', function(req, res){
	Article.findById(req.params.id, function(err, article){
		res.render('article', {
			"article": article
		})
	})
})

// get edit article page
app.get('/article/edit/:id', function(req, res){
	Article.findById(req.params.id, function(err, article){
		res.render('edit-article', {
			"title": "Edit an article",
			"article": article
		})
	})
})

// post edit article page
app.post('/articles/edit/:id', function(req, res){
	var article = {}
	article.title = req.body.title
	article.author = req.body.author
	article.body = req.body.body
	var query = {_id: req.params.id}
	Article.update(query, article, function(err){
		if(err){
			console.log(err)
			return
		} else {
			res.redirect('/')
		}
	})
})

// delete article
app.delete('/article/:id', function(req, res){
	var query = {_id: req.params.id}
	Article.remove(query, function(err){
		if(err){
			console.log(err)
		}
		res.send('Success')
	})
})

// post article
app.post('/articles/add', function(req, res){
	var article = new Article()
	article.title = req.body.title
	article.author = req.body.author
	article.body = req.body.body
	article.save(function(err){
		if(err){
			console.log(err)
			return
		} else {
			res.redirect('/')
		}
	})
})

app.listen(3000, function(){
	console.log('Server running on port 3000...')
})
