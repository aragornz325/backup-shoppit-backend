const { array } = require('joi');
const joi = require('joi');

const shema = joi.object({
  alto: joi.number().required(),
  ancho: joi.number().required(),
  largo: joi.number().required(),
  nombre: joi.string().required(),
  precio: joi.number(),
  descripcion: joi.string(),
  imagen: joi.string(),
});

const objetos = [
  {
    alto: 1,
    ancho: 3,
    largo: 150,
    nombre: 'test1',
    precio: 1,
    descripcion: 'test1',
    imagen: 'test1',
  },
  {
    alto: 2,
    ancho: 2,
    largo: 'test2',
    nombre: 'test2',
    precio: 2,
    descripcion: 'test2',
    imagen: 55,
  },
  {
    alto: 3,
    ancho: 3,
    largo: 3,
    nombre: 'hola',
    precio: 1,
    descripcion: 'test3',
    imagen: 'que tal',
  },
];

objetos.forEach((objeto) => {
  const { error } = shema.validate(objeto);
  if (error) {
    console.log(error);
  }
});
