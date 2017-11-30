var express = require('express')
var path = require('path')
var app = express()

// views
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', function(req, res){
	var articles = [
		{
			"id": 1,
			"title": "Article One",
			"author": "David Basil",
			"body": "This is article one"
		}
	]
	res.render('index', {
		"title": "title"
	})
})

// add article page
app.get('/articles/add', function(req, res){
	res.render('add-article', {
		"title": "Add Article"
	})	
})

app.listen(3000, function(){
	console.log('Server running on port 3000...')
})
