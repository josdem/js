var numbers = [12.10, 13.50, 20.00]

var total = 0
var counter = 0
var balance = 200.00

numbers.forEach(function(price){
  total += price
  counter += 1
})
balance -= total

if(balance >= total){
  console.log("Se realizo la compra!")
}

console.log('counter:', counter)
console.log('total:', total)
console.log('balance:', balance)

