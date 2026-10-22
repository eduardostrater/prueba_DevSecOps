const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const Tareas = require('../public/js/tareas.js');

function listaDePrueba() {
  return [
    { id: 'a', titulo: 'Tarea A', estado: 'pendiente' },
    { id: 'b', titulo: 'Tarea B', estado: 'completada' }
  ];
}

describe('HU-04 Marcar una tarea como completada', () => {
  test('una tarea pendiente pasa a completada', () => {
    const resultado = Tareas.alternarEstado(listaDePrueba(), 'a');
    assert.equal(resultado.find((t) => t.id === 'a').estado, 'completada');
  });

  test('una tarea completada vuelve a pendiente', () => {
    const resultado = Tareas.alternarEstado(listaDePrueba(), 'b');
    assert.equal(resultado.find((t) => t.id === 'b').estado, 'pendiente');
  });

  test('solo cambia la tarea indicada', () => {
    const resultado = Tareas.alternarEstado(listaDePrueba(), 'a');
    assert.equal(resultado.find((t) => t.id === 'b').estado, 'completada');
  });

  test('no modifica la lista original', () => {
    const original = listaDePrueba();
    Tareas.alternarEstado(original, 'a');
    assert.equal(original[0].estado, 'pendiente');
  });

  test('un ID inexistente no cambia ninguna tarea', () => {
    const original = listaDePrueba();
    const resultado = Tareas.alternarEstado(original, 'no-existe');
    assert.deepEqual(resultado, original);
  });
});

describe('HU-04 Criterios de seguridad', () => {
  test('S1: un estado fuera de la lista permitida se trata como pendiente', () => {
    assert.equal(Tareas.normalizarEstado('admin'), 'pendiente');
    assert.equal(Tareas.normalizarEstado(undefined), 'pendiente');
    assert.equal(Tareas.normalizarEstado('<script>'), 'pendiente');
  });

  test('S1: los estados permitidos se conservan', () => {
    assert.equal(Tareas.normalizarEstado('pendiente'), 'pendiente');
    assert.equal(Tareas.normalizarEstado('completada'), 'completada');
  });

  test('S1: una tarea con estado inválido pasa a completada al alternarla', () => {
    const lista = [{ id: 'x', titulo: 'X', estado: 'hackeado' }];
    const resultado = Tareas.alternarEstado(lista, 'x');
    assert.equal(resultado[0].estado, 'completada');
  });
});
