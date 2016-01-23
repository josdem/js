var countingRedCards = function(parkingLot){
  var counter = 0

  parkingLot.forEach(function(car){
    if(car.color == 'Red'){
      counter++
    }
  })

  return counter
}

var parkingLot = [
  {color:'Blue'},
  {color:'Red'},
  {color:'White'},
  {color:'Red'}
]

console.log('redCars: ' + countingRedCards(parkingLot))
