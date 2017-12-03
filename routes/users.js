var express = require('express')
var router = express.Router()
var User = require('../models/user')
var bcrypt = require('bcryptjs')
var passport = require('passport')

// register form
router.get('/register', function(req, res){
	res.render('register')
})

// register process
router.post('/register', function(req, res){
	var name = req.body.name
	var email = req.body.email
	var username = req.body.username
	var password = req.body.password
	var password2 = req.body.password2
	var newUser = new User({
		name: name,
		email: email,
		username: username,
		password: password
	})
	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(newUser.password, salt, function(err, hash){
			if(err){
				console.log(er)
			}
			newUser.password = hash
			newUser.save(function(err){
				if(err){
					console.log(err)
					return
				} else {
					res.redirect('/users/login')
				}
			})
		})
	})
})
// login form
router.get('/login', function(req, res){
	res.render('login')
})

// login process
router.post('/login', function(req, res, next){
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/users/login'
	})(req, res, next)
})

// logout
router.get('/logout', function(req, res){
	req.logout()
	res.redirect('/users/login')
})

module.exports = router
