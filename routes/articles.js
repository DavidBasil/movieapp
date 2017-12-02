var express = require('express')
var router = express.Router()
var Article = require('../models/article')

// get edit article page
router.get('/edit/:id', function(req, res){
	Article.findById(req.params.id, function(err, article){
		res.render('edit-article', {
			"title": "Edit an article",
			"article": article
		})
	})
})

// post edit article page
router.post('/edit/:id', function(req, res){
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
	var query = {_id: req.params.id}
	Article.remove(query, function(err){
		if(err){
			console.log(err)
		}
		res.send('Success')
	})
})

// post article
router.post('/add', function(req, res){
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

// get add article page
router.get('/add', function(req, res){
	res.render('add-article', {
		"title": "Add Article"
	})	
})

// get a single article
router.get('/:id', function(req, res){
	Article.findById(req.params.id, function(err, article){
		res.render('article', {
			"article": article
		})
	})
})

module.exports = router
