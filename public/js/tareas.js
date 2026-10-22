// Logica de tareas sin dependencias del DOM: se usa en el navegador y en los tests de Node.
(function (global) {
  const MAX_TITULO = 100;
  const MAX_DESCRIPCION = 500;
  const ESTADOS = ['pendiente', 'completada'];

  // Recorta espacios y elimina caracteres de control (HU-01 S3)
  function limpiarTexto(valor) {
    if (typeof valor !== 'string') return '';
    return valor.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
  }

  // Devuelve { ok, tarea } o { ok: false, error } (HU-01)
  function crearTarea(datos) {
    const titulo = limpiarTexto(datos && datos.titulo);
    const descripcion = limpiarTexto(datos && datos.descripcion);

    if (!titulo) {
      return { ok: false, error: 'El título es obligatorio' };
    }
    if (titulo.length > MAX_TITULO) {
      return { ok: false, error: `El título no puede superar ${MAX_TITULO} caracteres` };
    }
    if (descripcion.length > MAX_DESCRIPCION) {
      return { ok: false, error: `La descripción no puede superar ${MAX_DESCRIPCION} caracteres` };
    }

    return {
      ok: true,
      tarea: {
        id: crypto.randomUUID(),
        titulo,
        descripcion,
        estado: 'pendiente',
        fechaCreacion: new Date().toISOString()
      }
    };
  }

  // Inserta al inicio sin mutar la lista original (HU-01 criterio 1)
  function agregarTarea(lista, tarea) {
    return [tarea, ...lista];
  }

  // Normaliza el estado: cualquier valor fuera de la lista permitida es 'pendiente' (HU-04 S1)
  function normalizarEstado(estado) {
    return ESTADOS.includes(estado) ? estado : 'pendiente';
  }

  // Alterna pendiente/completada por ID, sin mutar la lista original (HU-04)
  function alternarEstado(lista, id) {
    return lista.map((tarea) => {
      if (tarea.id !== id) return tarea;
      const actual = normalizarEstado(tarea.estado);
      return { ...tarea, estado: actual === 'pendiente' ? 'completada' : 'pendiente' };
    });
  }

  const api = {
    MAX_TITULO,
    MAX_DESCRIPCION,
    ESTADOS,
    limpiarTexto,
    crearTarea,
    agregarTarea,
    normalizarEstado,
    alternarEstado
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.Tareas = api;
  }
})(this);
