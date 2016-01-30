var inquirer = require('inquirer')
var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/todo')

var toDoSchema = new Schema({
  name: String,
  description: String
})

var ToDo = mongoose.model('ToDo', toDoSchema)

inquirer.prompt([
  {
    type:'input',
    name:'name',
    message:'¿Cuál es el nombre de esta tarea?'
  },
  { type:'input',
    name:'description',
    message:'¿Cuál es la descripción de la tarea?'
  }
],function(answers){
  console.log('Tarea', answers)

  ToDo.create(answers, function(err, doc){
    if(err){
      console.log('Hubo error', err)
      return
    }

    console.log('El ToDo a sido creado', doc)
  })
})
