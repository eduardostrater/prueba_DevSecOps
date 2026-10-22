const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const Tareas = require('../public/js/tareas.js');

describe('HU-01 Crear tarea', () => {
  test('crea una tarea pendiente con título y descripción', () => {
    const resultado = Tareas.crearTarea({ titulo: 'Comprar pan', descripcion: 'Integral' });
    assert.equal(resultado.ok, true);
    assert.equal(resultado.tarea.titulo, 'Comprar pan');
    assert.equal(resultado.tarea.descripcion, 'Integral');
    assert.equal(resultado.tarea.estado, 'pendiente');
    assert.ok(!Number.isNaN(Date.parse(resultado.tarea.fechaCreacion)));
  });

  test('rechaza un título vacío', () => {
    const resultado = Tareas.crearTarea({ titulo: '' });
    assert.deepEqual(resultado, { ok: false, error: 'El título es obligatorio' });
  });

  test('rechaza un título con solo espacios', () => {
    const resultado = Tareas.crearTarea({ titulo: '    ' });
    assert.equal(resultado.ok, false);
  });

  test('rechaza datos ausentes o de tipo incorrecto', () => {
    assert.equal(Tareas.crearTarea(undefined).ok, false);
    assert.equal(Tareas.crearTarea({ titulo: 123 }).ok, false);
  });

  test('acepta un título de 100 caracteres y rechaza uno de 101', () => {
    assert.equal(Tareas.crearTarea({ titulo: 'a'.repeat(100) }).ok, true);
    assert.equal(Tareas.crearTarea({ titulo: 'a'.repeat(101) }).ok, false);
  });

  test('acepta una descripción de 500 caracteres y rechaza una de 501', () => {
    assert.equal(Tareas.crearTarea({ titulo: 'x', descripcion: 'a'.repeat(500) }).ok, true);
    assert.equal(Tareas.crearTarea({ titulo: 'x', descripcion: 'a'.repeat(501) }).ok, false);
  });

  test('agrega la tarea al inicio sin modificar la lista original', () => {
    const original = [{ id: '1' }];
    const nueva = { id: '2' };
    const resultado = Tareas.agregarTarea(original, nueva);
    assert.deepEqual(resultado.map((t) => t.id), ['2', '1']);
    assert.equal(original.length, 1);
  });
});

describe('HU-01 Criterios de seguridad', () => {
  test('S1: guarda el HTML como texto literal, sin alterarlo', () => {
    const payload = '<img src=x onerror=alert(1)>';
    const resultado = Tareas.crearTarea({ titulo: payload });
    assert.equal(resultado.tarea.titulo, payload);
  });

  test('S2: valida la longitud en JavaScript aunque se omita el maxlength del HTML', () => {
    const resultado = Tareas.crearTarea({ titulo: 'a'.repeat(10000) });
    assert.equal(resultado.ok, false);
  });

  test('S3: recorta espacios y elimina caracteres de control', () => {
    const resultado = Tareas.crearTarea({ titulo: '  \u0000Ho\u0007la\u001F  ' });
    assert.equal(resultado.tarea.titulo, 'Hola');
  });

  test('S3: un título formado solo por caracteres de control se rechaza', () => {
    const resultado = Tareas.crearTarea({ titulo: '\u0000\u0001\u0002' });
    assert.equal(resultado.ok, false);
  });

  test('genera IDs únicos con formato UUID', () => {
    const a = Tareas.crearTarea({ titulo: 'a' }).tarea.id;
    const b = Tareas.crearTarea({ titulo: 'b' }).tarea.id;
    assert.match(a, /^[0-9a-f-]{36}$/);
    assert.notEqual(a, b);
  });
});
