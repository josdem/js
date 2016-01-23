var inquirer = require('inquirer')
var guess = 8

var questions = [{
  type:'input',
  name:'number',
  message:'Adivina el número que estoy pensando(0..10):'
}]

inquirer.prompt(questions, function(answers){
  var number = Number.parseInt(answers.number)
  if(number == guess){
    console.log('Adivinaste')
  } else {
    console.log('Intenta nuevamente')
  }
})
