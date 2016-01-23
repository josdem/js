var coche = {
  placas: '773 ZBB',
  verificado: true,
  marca: 'VW',
  modelo: 'Clasico',
  color: 'Blanco',
  precio: 230000,
  dueno : {
    nombre: 'Jose Luis De la Cruz'
  }
}

if(coche.dueno.nombre == 'Jose Luis De la Cruz'){
  console.log('Ve en coche!')
} else if (coche.dueno.nombre == 'Santiago Zavala'){
  console.log('Pide el coche')
} else {
  console.log('Pide Uber')
}
