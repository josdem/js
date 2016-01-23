var coche = {
  placas: '773 ZBB',
  verificado: true,
  marca: 'VW',
  modelo: 'Clasico',
  color: 'Blanco',
  precio: 230000,
  lavado: false,
  gasolina: 30,
  dueno : {
    nombre: 'Santiago Zavala'
  }
}

if(coche.dueno.nombre == 'Jose Luis De la Cruz'){
  console.log('Ve en coche!')
} else if (coche.dueno.nombre == 'Santiago Zavala'){
  console.log('Pide el coche')
  coche.lavado = true
  coche.gasolina += 15
  console.log(coche)
} else {
  console.log('Pide Uber')
}
