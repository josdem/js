var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/todo')

var toDoSchema = new Schema({
  name: String,
  description: String
})

var ToDo = mongoose.model('ToDo', toDoSchema)

ToDo.find({}, function(err, docs){

})
