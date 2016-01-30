var express = require('express')
var swig = require('swig')
var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/todo')

var toDoSchema = new Schema({
  name: String,
  description: String
})

var ToDo = mongoose.model('ToDo', toDoSchema)

var application = express()

  //Swig configuration
  application.engine('html', swig.renderFile)
  application.set('view engine', 'html')
  application.set('views', __dirname + '/views')

  //Cache configuration
  // ToDo: Change cache:true in production
  application.set('view cache', false)
  swig.setDefaults({cache:false})

  application.get("/",function(request, response){

    ToDo.find({}, function(err, docs){
      if(err){
        return response.send(500, 'Internal Server Error')
      }

      response.render("index", {
        title: "Esta es una app",
        toDos: docs
      })
    })
  })

application.post('/addToDo', function(request, response){
  response.send('Informacion mandada')
})

application.listen(3000, function(){
  console.log('Server ready and listening at: 3000')
})
