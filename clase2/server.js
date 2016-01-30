var express = require('express')

var application = express()

application.get("/",function(request, response){
  response.send("Hello World!")
})

application.listen(3000, function(){
  console.log('Server ready and listening at: 3000')
})
