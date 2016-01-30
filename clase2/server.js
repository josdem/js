var express = require('express')
var swig = require('swig')

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
  response.render("index", {title: "Esta es una app"})
})

application.listen(3000, function(){
  console.log('Server ready and listening at: 3000')
})
