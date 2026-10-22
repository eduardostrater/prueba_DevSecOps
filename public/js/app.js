document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-tarea');
  const inputTitulo = document.getElementById('titulo');
  const inputDescripcion = document.getElementById('descripcion');
  const error = document.getElementById('error');
  const lista = document.getElementById('lista-tareas');
  const vacio = document.getElementById('vacio');

  let tareas = [];

  // Se construye con createElement y textContent para evitar XSS (HU-01 S1, HU-02 S1)
  function render() {
    lista.replaceChildren();
    tareas.forEach((tarea) => {
      const item = document.createElement('li');
      item.className = 'tarea';

      const titulo = document.createElement('strong');
      titulo.textContent = tarea.titulo;

      const descripcion = document.createElement('p');
      descripcion.textContent = tarea.descripcion;

      const estado = document.createElement('span');
      estado.className = 'estado';
      estado.textContent = tarea.estado === 'pendiente' ? 'Pendiente' : 'Completada';

      item.append(titulo, estado, descripcion);
      lista.appendChild(item);
    });
    vacio.hidden = tareas.length > 0;
  }

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const resultado = Tareas.crearTarea({
      titulo: inputTitulo.value,
      descripcion: inputDescripcion.value
    });

    if (!resultado.ok) {
      error.textContent = resultado.error;
      return;
    }

    error.textContent = '';
    tareas = Tareas.agregarTarea(tareas, resultado.tarea);
    form.reset();
    inputTitulo.focus();
    render();
  });

  render();
});
