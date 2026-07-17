# Skill: Aplicación web con Google Apps Script

## Propósito

Esta skill define las reglas técnicas obligatorias para desarrollar la aplicación “Estándar de Configuración Zona 3 Línea 2” con Google Apps Script, HTML Service, Google Sheets y Google Drive.

## Tecnologías permitidas

Base obligatoria:

- Google Apps Script
- HTML Service
- HTML5
- CSS
- JavaScript
- Google Sheets
- Google Drive
- clasp
- Git
- GitHub

No agregues tecnologías externas sin justificarlo y obtener aprobación.

## Arquitectura

Separar claramente:

- entrada web;
- controladores;
- servicios;
- repositorios;
- reglas de negocio;
- validaciones;
- seguridad;
- acceso a Sheets;
- acceso a Drive;
- historial;
- bloqueos;
- generación de PDF;
- utilidades;
- configuración.

No concentres toda la lógica en un solo archivo.

No dejes lógica crítica únicamente en el frontend.

## Configuración centralizada

Centralizar:

- IDs de hojas;
- nombres de hojas;
- IDs de carpetas Drive;
- dominios permitidos;
- zona horaria;
- estados;
- tipos de campo;
- tipos de imagen;
- límites de archivo;
- tiempo de bloqueo;
- mensajes;
- nombres de columnas.

Evitar valores mágicos dispersos.

## Seguridad

La aplicación solo debe permitir cuentas de:

- `@vspt.cl`
- `@vsptwinegroup.com`

Validar el dominio en backend en cada operación sensible.

No confiar en datos enviados por el navegador.

Aplicar:

- validación;
- sanitización;
- prevención de XSS;
- escape de HTML;
- validación MIME;
- validación de extensión;
- validación de tamaño;
- protección de IDs;
- mensajes de error controlados.

Los usuarios no deben necesitar acceso directo a Google Sheets.

## Google Sheets

Usar Sheets como almacenamiento inicial.

Buenas prácticas obligatorias:

- usar IDs únicos;
- usar filas estructuradas;
- usar `getValues()` y `setValues()`;
- evitar leer columnas completas;
- evitar múltiples `setValue()`;
- no depender de celdas fijas para lógica de negocio;
- usar índices lógicos cuando corresponda;
- validar duplicados en backend;
- excluir elementos inactivos en consulta;
- manejar estados sin borrar físicamente;
- mantener integridad referencial.

## Google Drive

Las imágenes ETQ y CET deben almacenarse en Drive.

Guardar en Sheets solo metadatos:

- ID del archivo;
- nombre;
- tipo;
- enlace;
- referencia al artículo.

Aceptar únicamente:

- JPG;
- JPEG;
- PNG.

Al reemplazar una imagen:

1. Subir la nueva.
2. Validar que la operación terminó correctamente.
3. Actualizar la referencia.
4. Eliminar la anterior.
5. Evitar archivos huérfanos.

## Imágenes

Priorizar:

- fluidez;
- bajo peso;
- buena calidad;
- carga diferida;
- miniaturas cuando convenga;
- modal de ampliación;
- responsive.

El usuario solo debe seleccionar la imagen.

La optimización debe ser interna.

## Concurrencia

Usar `LockService` en operaciones críticas.

Aplicar control de versión o marca de actualización cuando corresponda.

Evitar:

- dobles registros;
- artículos duplicados;
- relaciones duplicadas;
- borradores corruptos;
- escrituras simultáneas incompatibles;
- pérdida de datos.

## Bloqueo de borradores

Un borrador solo puede ser editado por una persona a la vez.

Debe almacenarse:

- ID del borrador;
- usuario;
- fecha de bloqueo;
- última actividad;
- vencimiento.

El bloqueo vence a los 15 minutos de inactividad.

Debe liberarse al:

- guardar;
- cerrar;
- salir;
- expirar.

Los demás usuarios pueden ver el borrador en modo lectura.

## Historial

Registrar como mínimo:

- fecha y hora;
- usuario;
- tipo de acción;
- motivo;
- producto;
- campo modificado;
- valor anterior;
- valor nuevo.

No exponer IDs internos innecesarios en la interfaz.

## PDF

Generar una ficha completa y profesional.

Debe incluir:

- branding;
- datos del producto;
- ETQ;
- CET;
- secciones;
- campos;
- valores;
- unidades;
- estado;
- fechas;
- usuarios;
- fecha de generación.

Cuidar:

- paginación;
- márgenes;
- calidad de imagen;
- saltos de página;
- legibilidad;
- encabezado;
- pie de página.

## Frontend

La interfaz debe ser:

- responsive;
- clara;
- profesional;
- simple;
- rápida;
- accesible;
- usable en computador, tablet y celular.

Paleta:

- blanco;
- negro;
- azul;
- verde claro.

El HTML de referencia es solo una guía visual.

No copiar literalmente su código ni sus datos.

## Formularios y validaciones

Validar en frontend y backend:

- código de artículo único;
- relaciones;
- campos obligatorios;
- estado de ETQ;
- estado de CET;
- imágenes requeridas;
- tipos de datos;
- números;
- unidades;
- estados;
- permisos.

## Manejo de errores

Usar respuestas consistentes, por ejemplo:

- `ok`
- `message`
- `data`
- `errorCode`

No mostrar al usuario:

- stack traces;
- nombres internos;
- IDs técnicos;
- errores crudos de Apps Script.

Registrar errores técnicos de forma separada.

## Rendimiento

Aplicar:

- caché cuando sea útil;
- carga diferida;
- consultas por ID;
- paginación;
- escrituras por lote;
- lecturas mínimas;
- prevención de recargas completas innecesarias.

## Codificación y ortografía

Todos los archivos deben guardarse en UTF-8.

Revisar especialmente:

- tildes;
- ñ;
- símbolos;
- nombres visibles;
- etiquetas;
- mensajes;
- PDFs.

No deben aparecer caracteres extraños.

## Pruebas

Cada fase debe incluir pruebas de:

- seguridad;
- validación;
- concurrencia;
- responsive;
- imágenes;
- PDF;
- estados;
- filtros;
- historial;
- bloqueos;
- recuperación de errores.

No considerar una fase terminada sin criterios de aceptación aprobados.

## Restricciones

No modificar proyectos anteriores.

No reutilizar bases de datos existentes.

No importar datos de ejemplo del HTML.

No comenzar desarrollo antes de la auditoría y aprobación.
