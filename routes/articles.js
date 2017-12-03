var express = require('express')
var router = express.Router()
var Article = require('../models/article')
var User = require('../models/user')

// get edit article page
router.get('/edit/:id', ensureAuthenticated, function(req, res){
	Article.findById(req.params.id, function(err, article){
		if(article.author != req.user._id){
			res.send('no authorized')
		}
		res.render('edit-article', {
			"title": "Edit an article",
			"article": article
		})
	})
})

// post edit article page
router.post('/edit/:id', ensureAuthenticated, function(req, res){
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
router.delete('/:id', function(req, res){
	if(!req.user._id){
		res.status(500).send()
	}
	var query = {_id: req.params.id}
	Article.findById(req.params.id, function(err, article){
		if(article.author != req.user._id){
			res.status(500).send()
		} else {
			Article.remove(query, function(err){
				if(err){
					console.log(err)
				}
				res.send('Success')
			})

		}
	})
})

// post article
router.post('/add', ensureAuthenticated, function(req, res){
	var article = new Article()
	article.title = req.body.title
	article.author = req.user._id
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

// get add article page
router.get('/add', function(req, res){
	res.render('add-article', {
		"title": "Add Article"
	})	
})

// get a single article
router.get('/:id', function(req, res){
	Article.findById(req.params.id, function(err, article){
		User.findById(article.author, function(err, user){
			res.render('article', {
				"article": article,
				"author": user.name
			})
		})
	})
})

// access control
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next()
	} else {
		res.json('you are not authenticated')
	}
}

module.exports = router
