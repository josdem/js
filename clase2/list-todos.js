var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/todo')

var toDoSchema = new Schema({
  name: String,
  description: String
})

var ToDo = mongoose.model('ToDo', toDoSchema)

ToDo.find({}, function(err, docs){
  if(err){
    console.log('Hubo error', err)
    return
  }

  console.log('Hay', docs.length, 'todos')

  docs.forEach(function(toDo){
    console.log('=>', toDo.name)
  })

})
