var express = require('express')
var swig = require('swig')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var uuid = require('uuid')
var bcrypt = require('bcrypt-nodejs')

var session = require('express-session')
var MongoStore = require('express-session-mongo')
var flash = require('flash')

var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/base-server')

// Declara tus modelos en este espacio
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

// Declara tus url handlers en este espacio
app.use(function (req, res, next){
	// Pasar a locals el nombre del usuario

  res.locals.username = req.session.username
	next()
})

app.get('/', function (req, res) {
	// Mostrar john doe o usuario
  if(res.locals.username){
	  res.send('Hello ' + res.locals.username)
  } else {
	  res.send('Hello Joe Doe')
  }
})

app.get('/u/:username', function (req, res){
	// Agregar en session el username
  req.session.username = req.params.username
	res.send('Welcome '+ req.params.username)
})
// Termina la declaracion de url handlers

app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
})
