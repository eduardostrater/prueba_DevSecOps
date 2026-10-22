# Historias de usuario — Gestor de Tareas

Aplicación web de gestión de tareas personales construida con JavaScript, HTML y CSS, servida por `server.js` (Node, sin dependencias). Los datos se guardan en el navegador (`localStorage`).

**Formato de cada historia**

- **Historia:** Como / Quiero / Para.
- **Criterios de aceptación:** escenarios en formato Dado / Cuando / Entonces.
- **Criterios de seguridad:** controles verificables, con su referencia OWASP o CWE.

---

## HU-01 — Crear una tarea

**Como** usuario, **quiero** registrar una tarea con título y descripción, **para** no olvidar lo que tengo pendiente.

**Criterios de aceptación**

1. **Dado** que estoy en la pantalla principal, **cuando** escribo un título y presiono "Agregar", **entonces** la tarea aparece al inicio de la lista con estado "Pendiente".
2. **Dado** que el título está vacío o solo tiene espacios, **cuando** presiono "Agregar", **entonces** no se crea la tarea y se muestra el mensaje "El título es obligatorio".
3. **Dado** que se creó la tarea, **entonces** el formulario se limpia y el foco vuelve al campo de título.
4. El título acepta hasta 100 caracteres y la descripción hasta 500.

**Criterios de seguridad**

- S1. Todo texto ingresado se muestra con `textContent`, nunca con `innerHTML`. Ingresar `<img src=x onerror=alert(1)>` se muestra como texto literal. *(OWASP A03 – XSS, CWE-79)*
- S2. Los límites de longitud se validan en JavaScript, no solo con `maxlength` en el HTML. *(CWE-20)*
- S3. Se recortan espacios y se eliminan caracteres de control antes de guardar. *(CWE-20)*

---

## HU-02 — Ver la lista de tareas

**Como** usuario, **quiero** ver todas mis tareas, **para** saber qué tengo pendiente.

**Criterios de aceptación**

1. **Dado** que tengo tareas registradas, **cuando** abro la aplicación, **entonces** veo la lista ordenada de la más reciente a la más antigua.
2. Cada tarea muestra título, estado y fecha de creación (formato `dd/mm/aaaa`).
3. **Dado** que no tengo tareas, **entonces** se muestra "No tienes tareas registradas".

**Criterios de seguridad**

- S1. La lista se construye con `document.createElement` y `textContent`; no se concatena HTML con datos. *(CWE-79)*
- S2. Si los datos guardados están corruptos o no son JSON válido, la aplicación muestra la lista vacía y un aviso, sin romperse ni ejecutar contenido. *(CWE-502)*

---

## HU-03 — Editar una tarea

**Como** usuario, **quiero** modificar el título o la descripción de una tarea, **para** corregir o actualizar su información.

**Criterios de aceptación**

1. **Dado** una tarea existente, **cuando** presiono "Editar", **entonces** sus campos pasan a modo edición con los valores actuales.
2. **Cuando** presiono "Guardar", **entonces** se actualizan los datos y se registra la fecha de modificación.
3. **Cuando** presiono "Cancelar" o la tecla Esc, **entonces** se descartan los cambios.
4. Se aplican las mismas validaciones de HU-01.

**Criterios de seguridad**

- S1. La tarea se identifica por un ID generado con `crypto.randomUUID()`, no por su posición en la lista. *(CWE-639)*
- S2. Si el ID no existe al guardar, la operación se rechaza sin crear una tarea nueva.

---

## HU-04 — Marcar una tarea como completada

**Como** usuario, **quiero** marcar una tarea como completada, **para** llevar control de mi avance.

**Criterios de aceptación**

1. **Dado** una tarea pendiente, **cuando** marco su casilla, **entonces** cambia a "Completada" y su título se muestra tachado.
2. **Dado** una tarea completada, **cuando** desmarco la casilla, **entonces** vuelve a "Pendiente".
3. El cambio se guarda de inmediato.

**Criterios de seguridad**

- S1. El estado solo admite los valores `pendiente` o `completada`; cualquier otro valor leído del almacenamiento se trata como `pendiente`. *(CWE-20)*

---

## HU-05 — Eliminar una tarea

**Como** usuario, **quiero** eliminar una tarea, **para** mantener mi lista limpia.

**Criterios de aceptación**

1. **Dado** una tarea, **cuando** presiono "Eliminar", **entonces** se pide confirmación.
2. **Cuando** confirmo, **entonces** la tarea desaparece de la lista y del almacenamiento.
3. **Cuando** cancelo, **entonces** la tarea se mantiene sin cambios.

**Criterios de seguridad**

- S1. La confirmación es obligatoria y no se puede omitir con doble clic ni con un atajo de teclado. *(CWE-1021)*
- S2. La eliminación se hace por ID único (ver HU-03 S1).

---

## HU-06 — Filtrar tareas por estado

**Como** usuario, **quiero** filtrar mis tareas por "Todas", "Pendientes" o "Completadas", **para** enfocarme en lo que me interesa.

**Criterios de aceptación**

1. **Cuando** selecciono un filtro, **entonces** solo se muestran las tareas que cumplen con él.
2. El filtro activo se resalta visualmente.
3. Se muestra el contador de tareas visibles (por ejemplo, "3 de 10").

**Criterios de seguridad**

- S1. Si el filtro se refleja en la URL (por ejemplo `#pendientes`), solo se aceptan valores de una lista permitida; cualquier otro valor aplica "Todas". *(CWE-20)*
- S2. El valor de la URL nunca se inserta en el DOM como HTML. *(DOM XSS, CWE-79)*

---

## HU-07 — Buscar tareas

**Como** usuario, **quiero** buscar tareas por texto, **para** encontrarlas rápido.

**Criterios de aceptación**

1. **Cuando** escribo en el buscador, **entonces** la lista se filtra por coincidencias en título o descripción, sin distinguir mayúsculas ni tildes.
2. **Dado** que no hay coincidencias, **entonces** se muestra "No se encontraron tareas".
3. La búsqueda se combina con el filtro de estado de HU-06.

**Criterios de seguridad**

- S1. La búsqueda usa `String.includes`, no construye expresiones regulares con el texto del usuario. *(ReDoS, CWE-1333)*
- S2. El texto buscado y el resaltado de coincidencias se muestran sin `innerHTML`. *(CWE-79)*
- S3. El término de búsqueda tiene un máximo de 100 caracteres.

---

## HU-08 — Conservar las tareas al recargar

**Como** usuario, **quiero** que mis tareas se mantengan al cerrar o recargar el navegador, **para** no perder mi información.

**Criterios de aceptación**

1. **Dado** que creé tareas, **cuando** recargo la página, **entonces** las tareas siguen ahí con su estado.
2. **Dado** que el almacenamiento del navegador no está disponible (modo privado o bloqueado), **entonces** la aplicación funciona en memoria y muestra un aviso.

**Criterios de seguridad**

- S1. No se guardan datos sensibles (contraseñas, tokens, datos personales) en `localStorage`; se informa al usuario que los datos quedan en su navegador. *(CWE-922)*
- S2. Al leer el almacenamiento, cada tarea se valida contra el esquema esperado (tipos, longitudes, estado permitido); las tareas inválidas se descartan. *(CWE-20)*
- S3. Todo acceso a `localStorage` va dentro de `try/catch`.

---

## HU-09 — Asignar prioridad y fecha límite

**Como** usuario, **quiero** asignar prioridad (Alta, Media, Baja) y fecha límite, **para** organizar mejor mi trabajo.

**Criterios de aceptación**

1. Al crear o editar, puedo elegir prioridad (por defecto "Media") y, de forma opcional, una fecha límite.
2. Las tareas vencidas y pendientes se resaltan en rojo.
3. Puedo ordenar la lista por prioridad o por fecha límite.

**Criterios de seguridad**

- S1. La prioridad solo admite los valores de la lista permitida. *(CWE-20)*
- S2. La fecha se valida como fecha real (`aaaa-mm-dd`); una fecha inválida se rechaza con un mensaje. *(CWE-20)*

---

## HU-10 — Exportar e importar tareas

**Como** usuario, **quiero** exportar mis tareas a un archivo JSON e importarlas después, **para** tener un respaldo o pasarlas a otro equipo.

**Criterios de aceptación**

1. **Cuando** presiono "Exportar", **entonces** se descarga `tareas-aaaa-mm-dd.json` con todas mis tareas.
2. **Cuando** importo un archivo válido, **entonces** se muestra cuántas tareas se agregarán y pide confirmación antes de hacerlo.
3. **Dado** un archivo inválido, **entonces** se muestra un error claro y no se modifica la lista actual.

**Criterios de seguridad**

- S1. Solo se aceptan archivos `.json` de hasta 1 MB y con un máximo de 1 000 tareas. *(CWE-400, CWE-434)*
- S2. El contenido se procesa con `JSON.parse`, nunca con `eval` ni `new Function`. *(CWE-95)*
- S3. Cada tarea importada pasa por la misma validación de esquema de HU-08 S2; se ignoran propiedades desconocidas como `__proto__` o `constructor`. *(Contaminación de prototipo, CWE-1321)*
- S4. Los IDs importados que ya existen se regeneran para evitar sobrescribir tareas.

---

## Criterios de seguridad transversales

Aplican a todo el proyecto y se verifican en el pipeline de DevSecOps.

| ID | Criterio | Referencia |
|----|----------|------------|
| T1 | El servidor envía la cabecera `Content-Security-Policy` con `default-src 'self'`, sin `unsafe-inline` ni `unsafe-eval`. | OWASP A05 |
| T2 | El servidor envía `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` y `Referrer-Policy: no-referrer`. | OWASP A05 |
| T3 | El servidor no permite leer archivos fuera de `public/` (por ejemplo `/../server.js` responde 403 o 404). | CWE-22 |
| T4 | Los errores devuelven mensajes genéricos sin rutas internas ni trazas. | CWE-209 |
| T5 | No hay scripts ni estilos en línea en el HTML; todo se carga desde archivos propios. | Requisito de T1 |
| T6 | `npm audit` no reporta vulnerabilidades altas ni críticas. | OWASP A06 |
| T7 | El repositorio no contiene secretos (verificado con un escáner de secretos en el pipeline). | CWE-798 |
| T8 | Solo se aceptan los métodos `GET` y `HEAD`; los demás responden 405. | OWASP A05 |
