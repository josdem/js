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
console.log('placas: ' + coche.placas, 'verificado:' + coche.verificado)
coche.verificado = false
console.log('placas: ' + coche.placas, 'verificado:' + coche.verificado)
coche.precio = coche.precio * 0.9
console.log('precio:',coche.precio)
