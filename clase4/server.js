var express = require('express')
var swig = require('swig')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var uuid = require('uuid')
var bcrypt = require('bcrypt-nodejs')
var omdb = require('omdb')

var session = require('express-session')
var MongoStore = require('express-session-mongo')
var flash = require('flash')

var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/base-server')

// Declara tus modelos en este espacio
var userSchema = Schema({
	username: String,
	displayName: String,
	password: String,
	uuid : {type: String, default: uuid.v4}
})

var User = mongoose.model('User', userSchema)

var movieSchema = Schema({
	title: String,
	imdb: String,
	plot: String,
	poster: String,
	rating: Number
})

var Movies = mongoose.model('Movie', movieSchema)

var movieUserRefsSchema = Schema({
	user: {type:Schema.Types.ObjectId, ref:'User'},
	movie: {type:Schema.Types.ObjectId, ref:'Movie'},
	watched: {type:Boolean, default:false}
})

var MovieUserRefs = mongoose.model('MovieUserRefs', movieUserRefsSchema)
// Termina la declaracion de modelos

var app = express()

// Add sessions and flash
app.use(session({
	secret: 'keyboard cat',
	store: new MongoStore(),
	saveUninitialized: true,
	resave: true
}))
// Correr en MongoDB:
// use express-sessions
// db.sessions.ensureIndex( { "lastAccess": 1 }, { expireAfterSeconds: 3600 } )
app.use( flash() )

// Configurar de swig!
app.engine('html', swig.renderFile)
app.set('view engine', 'html')
app.set('views', __dirname + '/views')

// Configurar cache
app.set('view cache', false)
swig.setDefaults({cache:false})// <-- Cambiar a true en produccion

// Agregamos body parser a express
app.use( bodyParser.urlencoded({ extended:false }) )

// Adds static assets
app.use('/assets', express.static('public'));

// Declara tus url handlers en este espacio
app.use(function (req, res, next) {
	if(!req.session.userId){
		return next()
	}

	User.findOne({uuid: req.session.userId}, function(err, user){
		if(err){
			return res.send(500, 'Internal Server Error')
		}

		res.locals.user = user
		next()
	})
});

app.get('/', function (req, res) {
	User.find({}, function(err, users){
		if(err){
			return res.send(500, 'Internal Server Error')
		}

		Movies.find({}, function(err, movies){
			if(err){
				return res.send(500, 'Internal Server Error')
			}

			res.render('index-final', {
				users:users,
				movies: movies
			})
		})
	})
})

// Empieza la App
app.get('/user/:uuid', function (req, res){
	User.findOne({uuid: req.params.uuid}, function(err, user){
		if(err){
			return res.send(500, 'Internal Server Error')
		}

		if(!user){
			return res.send(404, 'Not found')
		}

		MovieUserRefs.find({user:user._id})
		.populate('movie')
		.exec(function(err, refs){
			if(err){
				return res.send(500, 'Internal Server Error')
			}

			res.render('user-final', {
				currentUser:user,
				refs: refs
			})
		})
	})
})

app.get('/search', function (req, res){
	if(!res.locals.user){
		return res.redirect('/log-in')
	}

	if(!req.query.q){
		return res.render('search')
	}

	omdb.search({term:req.query.q, type:'movie'}, function(err, movies) {
		if(err){
			return res.send(500, 'Internal Server Error')
		}

		res.render('search-final', {
			search: req.query.q,
			movies: movies
		})
	});
})

app.get('/movies/:movieId', function (req, res){
	Movies.findOne({imdb:req.params.movieId}, function(err, movie){
		if(err){
			return res.send(500, 'Internal Server Error')
		}

		if(!movie){
			return res.send(404, 'Not found')
		}

		MovieUserRefs.find({movie:movie._id})
		.populate('user')
		.exec(function(err, refs){
			if(err){
				return res.send(500, 'Internal Server Error')
			}

			res.render('movie-final',{
				movie: movie,
				refs: refs
			})
		})
	})
})

var findOrCreateMovie = function(req, res, next){
	Movies.findOne({imdb:req.params.movieId}, function(err, movie){
		if(err){
			return res.send(500, 'Internal Server Error')
		}

		if(movie){
			res.locals.movie = movie
			return next()
		}

		omdb.get({ imdb: req.params.movieId }, true, function(err, data) {
			if(err){
				return res.send(500, 'Internal Server Error')
			}

			if(!data){
				return res.send(404, 'Not found')
			}

			Movies.create({
				title: data.title,
				plot: data.plot,
				poster: data.poster,
				imdb: data.imdb.id,
				rating: data.imdb.rating
			}, function(err, doc){
				if(err){
					return res.send(500, 'Internal Server Error')
				}

				res.locals.movie = doc
				next()				
			})
		})
	})
}

app.post('/movies/:movieId/add-to-queue', findOrCreateMovie, function (req, res){
	MovieUserRefs.findOne({
		movie: res.locals.movie,
		user: res.locals.user
	}, function(err, ref){
		if(err){
			return res.send(500, 'Internal Server Error')
		}		

		if(!ref){
			MovieUserRefs.create({
				movie: res.locals.movie,
				user: res.locals.user
			}, function(err, ref){
				if(err){
					return res.send(500, 'Internal Server Error')
				}

				req.flash('added', 'Movie added to your queue')
				res.redirect('/movies/'+res.locals.movie.imdb)
			})
		}else if(ref.watched){
			ref.watched = false
			ref.save(function(err){
				if(err){
					return res.send(500, 'Internal Server Error')
				}				

				req.flash('added', 'Movie added to your queue')
				res.redirect('/movies/'+res.locals.movie.imdb)
			})			
		}else{
			req.flash('added', 'Movie added to your queue')
			res.redirect('/movies/'+res.locals.movie.imdb)
		}
	})
})

app.post('/movies/:movieId/watched', findOrCreateMovie, function (req, res){
	// res.send(res.locals.movie)
	MovieUserRefs.findOne({
		movie: res.locals.movie,
		user: res.locals.user
	}, function(err, ref){
		if(err){
			return res.send(500, 'Internal Server Error')
		}

		if(ref){
			ref.watched = true
			ref.save(function(err){
				if(err){
					return res.send(500, 'Internal Server Error')
				}				

				req.flash('success', 'Movie marked as watched')
				res.redirect('/movies/'+res.locals.movie.imdb)
			})
		}else{
			MovieUserRefs.create({
				movie: res.locals.movie,
				user: res.locals.user,
				watched: true
			}, function(err, ref){
				req.flash('added', 'Movie added to your queue')
				res.redirect('/movies/'+res.locals.movie.imdb)
			})
		}

	})	
})
// Termina la app

// Ejemplos extra
app.get('/simple', function (req, res){
	res.render('simple')
})

app.get('/grid', function (req, res){
	res.render('grid')
})
// Termina ejemplos

app.get('/sign-up', function (req, res){
	var error = res.locals.flash.pop()

	res.render('sign-up', {
		error: error
	})
})

app.get('/log-in', function (req, res){
	var error = res.locals.flash.pop()

	res.render('log-in',{
		error: error
	})
})

app.get('/log-out', function (req, res){
	req.session.destroy()
	res.redirect('/')
})

app.post('/sign-up', function (req, res){
	if(!req.body.username || !req.body.password){
		req.flash('sign-up-error', 'To sign up you need a username and a password')
		return res.redirect('/sign-up')		
	}

	User.findOne({username: req.body.username}, function(err, doc){
		if(err){
			return res.send(500, 'Internal Server Error')
		}

		if(doc){
			req.flash('sign-up-error', 'Username is taken')
			return res.redirect('/sign-up')
		}

		bcrypt.hash(req.body.password, null/* Salt */, null, function(err, hashedPassword) {
			if(err){
				return res.send(500, 'Internal Server Error')
			}

			User.create({
				username: req.body.username,
				password: hashedPassword
			}, function(err, doc){
				if(err){
					return res.send(500, 'Internal Server Error')
				}

				req.session.userId = doc.uuid
				res.redirect('/')
			})
		});
	})
})

app.post('/log-in', function (req, res){
	if(!req.body.username || !req.body.password){
		req.flash('log-in-error', 'To log in you need a username and a password')
		return res.redirect('/log-in')
	}

	User.findOne({username: req.body.username}, function(err, doc){
		if(err){
			return res.send(500, 'Internal Server Error')
		}

		if(!doc){
			req.flash('log-in-error', 'Invalid user')
			return res.redirect('/log-in')
		}

		bcrypt.compare(req.body.password, doc.password, function(err, result){
			if(err){
				return res.send(500, 'Internal Server Error')
			}

			req.session.userId = doc.uuid
			res.redirect('/')
		})
	})
})

// Termina la declaracion de url handlers
app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
})