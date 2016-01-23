var asistentes = [
  {
    nombre:'Xhanil Lopez',
    profesor:false,
    altura:200
  },
  {
    nombre:'Manu Uribe',
    profesor:false,
    altura:200
  },
  {
    nombre:'Richard Kaufman',
    profesor:true,
    altura:200
  }
]
console.log('Manu',asistentes[1])
console.log('Numero:',asistentes.length)

asistentes.push({nombre:'Sergio',profesor:false,altura:200})

console.log('Asistentes',asistentes)
console.log("Numero:",asistentes.length)

console.log("Asistente:",asistentes.pop())
