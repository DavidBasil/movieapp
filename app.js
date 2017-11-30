var express = require('express')
var path = require('path')
var mongoose = require('mongoose')

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

// views
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

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

// post article
app.post('/articles/add', function(req, res){
})

app.listen(3000, function(){
	console.log('Server running on port 3000...')
})
