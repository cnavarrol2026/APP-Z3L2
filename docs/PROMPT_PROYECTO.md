# ACTUALIZACIÓN APROBADA 2026-07-17

Estas decisiones reemplazan cualquier punto anterior que indique algo distinto:

- Acceso: cualquier cuenta Google autenticada puede entrar si conoce el enlace.
- No hay roles; todos los usuarios que entren pueden administrar.
- Imágenes: solo PNG, máximo 1 MB.
- PDF: no incluye imágenes ETQ/CET para mantenerlo liviano.
- Borradores: no se permite edición simultánea.
- Validaciones críticas: centralizadas en backend.
- Historial: debe registrar cambios campo a campo.
- Respaldo: botón manual para generar ZIP con CSV por hoja y JSON maestro.
- Base inicial: completamente vacía.
- HTML de referencia: solo guía visual, sin copiar datos ni lógica.
- No se modifican proyectos anteriores.

# INSTRUCCIÓN PREVIA OBLIGATORIA

Antes de analizar, planificar o escribir código:

1. Lee completamente este archivo `PROMPT_PROYECTO.md`.
2. Lee todas las skills ubicadas en la carpeta `/skills`.
3. Lee primero:
   - `/skills/auditoria-proyecto/SKILL.md`
   - `/skills/apps-script-webapp/SKILL.md`
4. Analiza el archivo `MANUAL Z3 PRUEBA.html` únicamente como referencia visual y estructural.
5. Revisa los recursos disponibles en la carpeta `/branding`.
6. No escribas código hasta completar la auditoría solicitada y recibir aprobación explícita.
7. Si alguna instrucción entra en conflicto, prioriza:
   - este archivo `PROMPT_PROYECTO.md`;
   - luego `/skills/auditoria-proyecto/SKILL.md`;
   - luego `/skills/apps-script-webapp/SKILL.md`.
8. Las instrucciones de las skills son obligatorias durante la auditoría, planificación, desarrollo, pruebas y despliegue.
9. No agregues tecnologías, librerías o servicios externos sin justificarlo y solicitar aprobación.
10. Mantén el sistema simple para el usuario y sólido internamente.

---

# Proyecto: Estándar de Configuración Zona 3 Línea 2

Quiero desarrollar un proyecto completamente nuevo llamado:

**“Estándar de Configuración Zona 3 Línea 2”**

El proyecto será una aplicación web empresarial construida con:

- Google Apps Script
- HTML Service
- HTML5
- CSS
- JavaScript
- Google Sheets como almacenamiento inicial
- Google Drive para almacenar imágenes
- clasp para desarrollo local
- Git y GitHub para control de versiones

El proyecto debe ser completamente independiente de cualquier sistema anterior.

Debe crearse:

- un Google Sheets nuevo;
- un proyecto de Google Apps Script nuevo;
- una aplicación web nueva;
- un repositorio GitHub nuevo;
- una estructura modular preparada para crecer.

No debes modificar, conectar ni depender de ningún proyecto anterior.

El archivo `MANUAL Z3 PRUEBA.html` debe utilizarse únicamente como referencia visual y estructural para comprender:

- encabezado;
- selectores superiores;
- panel visual de imágenes;
- secciones de parámetros;
- tarjetas de información;
- diseño responsive.

No debes copiar sus datos de ejemplo, sus productos, sus parámetros ni su base de datos JavaScript.

La base de datos de la nueva aplicación debe comenzar completamente vacía.

---

## 1. PROCESO OBLIGATORIO ANTES DE DESARROLLAR

No debes comenzar a programar inmediatamente.

Primero debes:

1. Auditar completamente este planteamiento.
2. Identificar contradicciones, vacíos, riesgos y decisiones técnicas dudosas.
3. Detectar posibles problemas funcionales.
4. Revisar si Google Apps Script es adecuado para cada requerimiento.
5. Proponer mejoras sin complicar innecesariamente el sistema.
6. Explicar claramente cada mejora propuesta.
7. Separar las mejoras en:
   - obligatorias;
   - recomendadas;
   - opcionales.
8. Esperar mi decisión sobre las mejoras propuestas.
9. Solo después, estructurar el plan definitivo de desarrollo.
10. Presentar el plan por fases.
11. Esperar mi aprobación explícita.
12. Solo después de mi aprobación podrás comenzar a desarrollar.
13. El desarrollo deberá realizarse paso a paso, por fases ordenadas y verificables.

No debes programar antes de recibir mi aprobación explícita.

---

## 2. CALIDAD DE TEXTO Y CODIFICACIÓN

Debes cuidar estrictamente:

- ortografía;
- acentuación;
- gramática;
- mayúsculas y minúsculas;
- consistencia de nombres;
- claridad de mensajes;
- uso correcto del español.

Toda la aplicación debe trabajar con codificación UTF-8.

Debes evitar:

- caracteres extraños;
- textos dañados;
- símbolos incorrectos;
- problemas con tildes;
- problemas con la letra ñ;
- textos duplicados;
- etiquetas mal escritas;
- mensajes técnicos incomprensibles para el usuario.

Antes de cada entrega debes revisar visualmente los textos mostrados en pantalla.

---

## 3. OBJETIVO GENERAL

Crear una aplicación web moderna, profesional, limpia, rápida y responsive para consultar y administrar los estándares de configuración de Zona 3 Línea 2.

El sistema permitirá seleccionar:

1. Categoría
2. Botella
3. Código de Artículo + Descripción

Los tres selectores estarán relacionados en cascada.

El flujo será:

**Categoría → Botellas asociadas → Artículos asociados → Ficha técnica completa**

---

## 4. NOMBRE DE LA APLICACIÓN

El nombre visible será:

**Estándar de Configuración Zona 3 Línea 2**

Debe aparecer en el encabezado principal junto con el logo corporativo.

---

## 5. ACCESO CORPORATIVO

La aplicación debe exigir una sesión válida de Google.

Solo podrán acceder usuarios cuyos correos pertenezcan a estos dominios:

- `@vspt.cl`
- `@vsptwinegroup.com`

No debe permitirse:

- acceso anónimo;
- cuentas personales;
- cuentas externas;
- usuarios sin correo corporativo permitido.

La validación debe realizarse en backend.

No basta con ocultar la interfaz.

La autorización debe verificarse también en cada operación sensible:

- consultar;
- crear;
- editar;
- desactivar;
- reactivar;
- guardar borradores;
- descartar borradores;
- recuperar borradores;
- cargar imágenes;
- reemplazar imágenes;
- consultar historial;
- generar PDF.

Debes auditar las restricciones reales del despliegue de Apps Script para permitir ambos dominios y proponer la configuración correcta.

---

## 6. DISEÑO GENERAL

La aplicación debe conservar la idea estructural del HTML de referencia, pero con un diseño completamente modernizado.

Debe ser:

- profesional;
- limpia;
- sencilla;
- rápida;
- intuitiva;
- ordenada;
- responsive;
- adecuada para uso industrial;
- fácil de utilizar en planta.

Debe adaptarse correctamente a:

- computador;
- tablet;
- celular.

La paleta principal debe combinar de forma profesional:

- blanco;
- negro;
- azul;
- verde claro.

Debes proponer tonos exactos que tengan:

- buen contraste;
- accesibilidad;
- lectura cómoda;
- coherencia visual;
- apariencia corporativa.

No debes sobrecargar la interfaz.

Debe existir un encabezado fijo con:

- logo;
- nombre del sistema;
- navegación principal;
- usuario corporativo conectado;
- control visual claro.

---

## 7. SELECTORES PRINCIPALES

En la parte superior de la pantalla principal deben existir tres selectores relacionados:

- Categoría
- Botella
- Código de Artículo + Descripción

El tercer selector mostrará visualmente:

**CÓDIGO - DESCRIPCIÓN**

Internamente el código y la descripción deben almacenarse por separado.

Los selectores deben funcionar en cascada:

1. Al seleccionar una categoría, solo se muestran las botellas relacionadas.
2. Al seleccionar una botella, solo se muestran los artículos relacionados con esa combinación.
3. Al seleccionar el artículo, se muestra toda su ficha técnica.

Solo deben mostrarse elementos activos.

Los borradores e inactivos no deben aparecer en la consulta normal.

---

## 8. RELACIONES DE DATOS

Las relaciones funcionales serán:

- Una categoría puede tener varias botellas.
- Una botella puede pertenecer a varias categorías.
- La relación Categoría ↔ Botella es muchos a muchos.
- Una combinación Categoría + Botella puede tener varios artículos.
- Cada artículo pertenece a una sola combinación Categoría + Botella.
- El Código de Artículo debe ser único en todo el sistema.
- La descripción del artículo puede repetirse.
- Cada artículo tendrá todos sus parámetros completos e independientes.
- No se utilizará herencia automática de parámetros desde la botella.

---

## 9. BASE DE DATOS INICIAL

La base debe comenzar completamente vacía:

- sin categorías;
- sin botellas;
- sin artículos;
- sin parámetros;
- sin secciones;
- sin unidades;
- sin imágenes;
- sin registros de ejemplo;
- sin configuraciones precargadas.

El HTML de referencia no debe importar ni copiar sus datos de ejemplo.

---

## 10. FICHA TÉCNICA DEL ARTÍCULO

Cada artículo tendrá una ficha técnica completa.

La ficha mostrará:

- Categoría
- Botella
- Código de Artículo
- Descripción
- Estado
- ETQ
- CET
- Secciones configuradas
- Campos dinámicos
- Valores
- Unidades
- Fecha de creación
- Última fecha de modificación
- Usuario creador
- Usuario de la última modificación

La ficha de consulta será solo de lectura.

No debe contener botones directos para editar.

Las modificaciones se realizarán exclusivamente desde Configuración.

---

## 11. IMÁGENES ETQ Y CET

Cada artículo debe manejar dos posibles imágenes:

- ETQ: Etiqueta
- CET: Contraetiqueta

En la creación o edición del artículo existirán dos controles independientes:

- ETQ: Aplica / No aplica
- CET: Aplica / No aplica

Cuando ETQ esté en “Aplica”:

- el Código ETQ será obligatorio;
- la Imagen ETQ será obligatoria.

Cuando CET esté en “Aplica”:

- el Código CET será obligatorio;
- la Imagen CET será obligatoria.

Cuando estén en “No aplica”:

- sus campos deben deshabilitarse;
- la ficha debe mostrar “No aplica”.

Algunos artículos podrán tener:

- solo ETQ;
- ETQ y CET.

Cuando existan ambas:

- ETQ debe mostrarse arriba;
- CET debe mostrarse abajo;
- ambas deben verse al mismo tiempo;
- cada imagen debe tener su código visible;
- cada imagen debe poder ampliarse.

Cuando solo exista ETQ:

- se mostrará únicamente ETQ;
- el espacio de CET no debe quedar vacío innecesariamente.

---

## 12. NOTA DE AYUDA PARA ETQ Y CET

En la sección de carga de imágenes debe aparecer una nota clara indicando:

> Para ubicar la Etiqueta (ETQ) o Contraetiqueta (CET), acceda al siguiente enlace y reemplace GBO por el código exacto de la ETQ o CET.

Enlace original:

`https://dsgr.ccu.cl/GBO.pdf`

Puede mostrarse visualmente el patrón:

`https://dsgr.ccu.cl/CODIGO.pdf`

Pero el enlace clicable debe dirigir al enlace original:

`https://dsgr.ccu.cl/GBO.pdf`

La aplicación no intentará obtener automáticamente las imágenes desde ese PDF.

Las imágenes se cargarán manualmente desde el computador.

---

## 13. CARGA DE IMÁGENES

El operador únicamente deberá:

1. Pulsar “Agregar imagen”.
2. Seleccionar el archivo desde su computador.
3. Esperar la confirmación de carga.

No deberá:

- comprimir;
- convertir;
- renombrar;
- redimensionar;
- mover archivos manualmente.

Solo se aceptarán:

- JPG;
- JPEG;
- PNG.

No se aceptarán PDF ni otros formatos.

El sistema deberá encargarse internamente de:

- validar el tipo de archivo;
- validar el peso;
- optimizar la imagen;
- reducir dimensiones cuando sea necesario;
- conservar buena calidad visual;
- subirla a Google Drive;
- registrar su ID y enlace en Google Sheets;
- mostrarla inmediatamente.

Las imágenes deben guardarse en Google Drive.

Google Sheets solo debe guardar:

- ID del archivo;
- nombre;
- enlace;
- tipo de imagen;
- referencia al artículo.

La estrategia debe priorizar:

- velocidad de carga;
- bajo consumo de almacenamiento;
- facilidad de mantenimiento.

Al reemplazar una imagen:

- se subirá la nueva;
- se actualizará la ficha;
- se eliminará definitivamente la imagen anterior de Google Drive.

---

## 14. CONFIGURACIÓN DINÁMICA

Los parámetros del artículo no serán fijos.

Desde Configuración se podrán crear y organizar las secciones y campos.

### Secciones

Desde Configuración se podrá:

- crear secciones;
- editar el nombre;
- ordenar su posición;
- activar;
- desactivar.

Ejemplos posibles:

- Botella e insumos
- Etiquetadora
- Capsuladora

Estos nombres son solo ejemplos.

La base inicial debe comenzar sin secciones.

### Campos dinámicos

Dentro de cada sección se podrán crear campos.

Por ahora existirán solo dos tipos:

- Texto
- Número

Cada campo podrá configurarse como:

- obligatorio;
- opcional;
- activo;
- inactivo;
- asociado a una sección;
- ordenado dentro de la sección.

No se requieren por ahora:

- listas cerradas;
- campos Sí/No;
- campos de color;
- campos de imagen adicionales.

Cuando se cree un artículo nuevo, el sistema debe cargar automáticamente:

- todas las secciones activas;
- todos los campos activos;
- respetando su orden.

---

## 15. CAMPOS NUMÉRICOS Y UNIDADES

Los campos numéricos podrán tener una unidad.

La unidad no será obligatoria.

El operador podrá:

- seleccionar una unidad;
- dejar el campo sin unidad.

No habrá una unidad predeterminada obligatoria.

Las unidades se elegirán desde un catálogo administrable.

---

## 16. CATÁLOGO DE UNIDADES

Desde Configuración se podrá:

- agregar unidades;
- editar unidades;
- activar unidades;
- desactivar unidades;
- ordenar unidades.

Ejemplos:

- mm
- cm
- bar
- rpm

Estos son solo ejemplos.

La base inicial debe comenzar sin unidades cargadas.

---

## 17. ESTADOS Y DESACTIVACIÓN

Las siguientes entidades podrán activarse o desactivarse sin borrarse físicamente:

- Categorías
- Botellas
- Artículos
- Secciones
- Campos
- Unidades

En las pantallas administrativas debe existir un control:

**Mostrar desactivados**

Comportamiento:

- Desmarcado: muestra solo activos.
- Marcado: muestra activos y desactivados.

Los desactivados deben diferenciarse visualmente.

### Reglas de desactivación

#### Categoría

- Al desactivar una categoría, dejará de aparecer en consulta.
- Sus botellas no se desactivan.
- Sus artículos no se desactivan.
- Las botellas y artículos seguirán disponibles en otras categorías donde correspondan.

#### Botella

- Al desactivar una botella, dejará de aparecer en todas las categorías.
- Sus artículos no se desactivarán automáticamente.
- Los artículos relacionados quedarán conservados.
- No estarán disponibles en consulta mientras la botella esté desactivada.

#### Reactivación de botella

- Al reactivarla, volverán sus relaciones con categorías.
- Sus artículos activos volverán a estar disponibles.

#### Artículo

- Al desactivar un artículo, dejará de aparecer en el tercer selector.
- No afectará la categoría.
- No afectará la botella.
- Podrá reactivarse desde Configuración.

---

## 18. ESTADOS DEL PRODUCTO

Cada producto tendrá uno de estos estados:

- Borrador
- Activo
- Inactivo

El estado debe mostrarse claramente en:

- Configuración;
- ficha;
- PDF.

### Borrador

- No aparece en los selectores principales.
- Se administra desde Configuración.
- Puede continuar editándose.

### Activo

- Aparece en consulta.
- Puede editarse desde Configuración.
- Las modificaciones se aplican directamente.

### Inactivo

- No aparece en consulta.
- Se conserva en el sistema.
- Puede reactivarse.

Antes de activar un borrador, el sistema deberá validar:

- categoría;
- botella;
- código de artículo único;
- descripción;
- campos obligatorios;
- ETQ, si aplica;
- CET, si aplica;
- imágenes requeridas;
- relaciones correctas.

No debe permitirse activar un producto incompleto.

---

## 19. NAVEGACIÓN

La aplicación debe tener una navegación clara.

Como mínimo:

- Consulta
- Configuración

Dentro de Configuración debe haber pestañas internas:

- Categorías
- Botellas
- Artículos
- Secciones y campos
- Unidades
- Pendientes
- Descartados
- Historial

Cada pestaña permitirá, según corresponda:

- agregar;
- editar;
- activar;
- desactivar;
- consultar;
- reactivar.

---

## 20. BOTÓN “AGREGAR PRODUCTO NUEVO”

En la pantalla principal debe existir un botón destacado:

**Agregar producto nuevo**

Al pulsarlo se abrirá un modal tipo asistente.

El asistente seguirá este flujo:

1. Seleccionar o crear categoría.
2. Seleccionar o crear botella.
3. Asociar la botella con la categoría.
4. Ingresar Código de Artículo.
5. Ingresar Descripción.
6. Definir ETQ: Aplica / No aplica.
7. Definir CET: Aplica / No aplica.
8. Ingresar Código ETQ, si aplica.
9. Cargar Imagen ETQ, si aplica.
10. Ingresar Código CET, si aplica.
11. Cargar Imagen CET, si aplica.
12. Completar todas las secciones y campos activos.
13. Revisar un resumen.
14. Guardar como borrador o completar.
15. Activar cuando cumpla todas las validaciones.

El asistente debe permitir:

- seleccionar categoría existente;
- crear categoría nueva;
- seleccionar botella existente;
- crear botella nueva;
- crear la relación correspondiente.

No debe crear duplicados.

---

## 21. CÓDIGO DE ARTÍCULO ÚNICO

El Código de Artículo debe ser único en todo el sistema.

No debe permitirse guardar otro producto con el mismo Código de Artículo.

La validación debe realizarse en frontend y backend.

La descripción puede repetirse.

---

## 22. BORRADORES

El asistente permitirá guardar como borrador.

El borrador conservará:

- categoría;
- botella;
- código de artículo;
- descripción;
- estado ETQ;
- estado CET;
- códigos;
- imágenes;
- secciones completadas;
- campos completados;
- etapa del asistente;
- fecha de creación;
- creador;
- última modificación;
- usuario de última modificación.

Los borradores deben aparecer dentro de Configuración, en la pestaña:

**Pendientes**

Desde allí se podrá:

- abrir;
- continuar;
- editar;
- completar;
- activar;
- descartar.

---

## 23. BORRADORES COMPARTIDOS

Todos los usuarios autorizados de ambos dominios podrán:

- ver;
- abrir;
- editar;
- completar los borradores.

No estarán limitados al usuario creador.

---

## 24. BLOQUEO DE EDICIÓN DE BORRADORES

No debe permitirse que dos usuarios editen simultáneamente el mismo borrador.

Cuando un usuario lo abra para editar:

- quedará bloqueado;
- se mostrará quién lo tiene abierto;
- otros podrán verlo en modo lectura;
- no podrán editarlo.

El bloqueo se liberará al:

- guardar;
- cerrar;
- salir;
- expirar por inactividad.

El bloqueo expirará después de 15 minutos sin actividad.

Debes proponer una implementación segura usando Apps Script, PropertiesService, CacheService, LockService o una combinación adecuada.

---

## 25. DESCARTAR BORRADOR

Descartar un borrador exigirá motivo obligatorio.

No debe eliminarse definitivamente.

Al descartarlo se guardará:

- ID;
- datos cargados;
- etapa;
- motivo;
- fecha y hora;
- correo corporativo;
- estado DESCARTADO.

---

## 26. BORRADORES DESCARTADOS

Los borradores descartados deben guardarse de forma separada e independiente.

Podrá utilizarse una hoja como:

**BORRADORES_DESCARTADOS**

Desde Configuración habrá una pestaña:

**Descartados**

Desde allí se podrán:

- consultar;
- abrir;
- recuperar.

Al recuperar un borrador:

- volverá a Pendientes;
- conservará toda la información;
- retomará la misma etapa;
- se registrará fecha;
- se registrará hora;
- se registrará correo corporativo.

---

## 27. MODIFICACIÓN DE PRODUCTOS ACTIVOS

Los productos activos se editarán desde Configuración.

No se editarán desde la ficha de consulta.

Las modificaciones se aplicarán directamente sobre la ficha vigente.

No pasarán nuevamente a revisión.

Toda modificación de un producto activo exigirá:

- motivo de cambio obligatorio;
- correo del usuario;
- fecha;
- hora.

La ficha mostrará inmediatamente la información actualizada.

---

## 28. HISTORIAL

Debe existir una pestaña **Historial** dentro de Configuración.

No debe mostrarse en la ficha pública de consulta.

El historial guardará:

- Fecha y hora
- Usuario
- Tipo de acción
- Motivo
- Producto afectado
- Campos modificados
- Valor anterior
- Valor nuevo

Debe permitir filtrar por:

- Producto
- Fecha
- Rango de fechas
- Usuario

El historial debe contemplar, como mínimo:

- creación;
- modificación;
- activación;
- desactivación;
- reactivación;
- descarte de borrador;
- recuperación de borrador;
- reemplazo de imágenes.

---

## 29. PDF DE LA FICHA

La ficha completa del producto podrá:

- imprimirse;
- descargarse en PDF.

El PDF siempre incluirá la ficha completa.

No habrá selección parcial de secciones.

Debe incluir:

- Logo
- Nombre del sistema
- Categoría
- Botella
- Código de Artículo
- Descripción
- Estado
- Código ETQ
- Imagen ETQ
- Código CET
- Imagen CET
- “No aplica” cuando corresponda
- Todas las secciones activas
- Todos los campos configurados
- Valores
- Unidades
- Fecha de creación
- Última fecha de modificación
- Usuario creador
- Usuario de última modificación
- Fecha de generación del PDF

Debe cuidarse:

- paginación;
- calidad de imágenes;
- legibilidad;
- márgenes;
- encabezado;
- pie de página;
- saltos de sección;
- apariencia profesional.

---

## 30. GOOGLE SHEETS

Debes auditar y proponer el modelo de datos definitivo.

Como referencia inicial, considera hojas similares a:

- CONFIGURACION
- CATEGORIAS
- BOTELLAS
- CATEGORIA_BOTELLA
- ARTICULOS
- SECCIONES
- CAMPOS
- UNIDADES
- VALORES_ARTICULO
- IMAGENES_ARTICULO
- BORRADORES
- VALORES_BORRADOR
- BORRADORES_DESCARTADOS
- HISTORIAL
- BLOQUEOS

Esta estructura es una propuesta inicial.

Debes auditarla y proponer una mejor si es necesario.

No debes duplicar información sin justificación.

Debes definir:

- IDs únicos;
- claves;
- relaciones;
- estados;
- fechas;
- usuarios;
- índices lógicos;
- validaciones;
- reglas de integridad.

---

## 31. ARQUITECTURA DEL CÓDIGO

Debes separar claramente:

- interfaz;
- navegación;
- controladores;
- servicios;
- repositorios;
- reglas de negocio;
- validaciones;
- acceso a Google Sheets;
- manejo de Drive;
- generación de PDF;
- seguridad;
- historial;
- bloqueos;
- utilidades;
- configuración.

No debe existir toda la lógica en un solo archivo.

No debe existir lógica crítica únicamente en el frontend.

Las reglas importantes deben validarse también en backend.

Debe existir una configuración centralizada para:

- nombres de hojas;
- estados;
- dominios permitidos;
- tipos de campo;
- tipos de imagen;
- tiempo de bloqueo;
- mensajes;
- límites de archivos;
- IDs de carpetas;
- zona horaria.

---

## 32. SEGURIDAD

Debes auditar y proponer:

- validación de dominio;
- manejo seguro del correo activo;
- protección de funciones backend;
- validación de parámetros;
- prevención de inyección HTML;
- prevención de XSS;
- sanitización de texto;
- validación de nombres de archivo;
- validación MIME;
- validación de tamaño;
- permisos de Drive;
- permisos de Sheets;
- protección contra acceso directo no autorizado.

Los operadores no deben necesitar acceso directo a la hoja de cálculo.

---

## 33. CONCURRENCIA

Debes considerar que varios usuarios pueden trabajar al mismo tiempo.

Debes utilizar estrategias como:

- LockService;
- escrituras por lotes;
- validación de versión;
- control de bloqueo de borradores;
- prevención de doble envío;
- prevención de duplicados;
- operaciones atómicas cuando sea posible.

No deben generarse:

- artículos duplicados;
- relaciones duplicadas;
- imágenes huérfanas;
- borradores corruptos;
- pérdida de datos.

---

## 34. RENDIMIENTO

Debes evitar:

- leer columnas completas;
- múltiples llamadas innecesarias a Sheets;
- múltiples `setValue`;
- cargas completas sin necesidad;
- reconstruir toda la aplicación en cada acción;
- imágenes pesadas;
- consultas repetitivas.

Debes utilizar cuando corresponda:

- `getValues` y `setValues`;
- caché;
- consultas por ID;
- paginación;
- carga diferida;
- miniaturas;
- almacenamiento de metadatos;
- índices lógicos.

---

## 35. MANEJO DE ERRORES

Debe existir manejo de errores con:

- try/catch;
- mensajes claros;
- registro técnico;
- recuperación segura;
- limpieza de bloqueos;
- eliminación de archivos huérfanos;
- respuesta consistente al frontend.

Los mensajes visibles deben ser comprensibles para usuarios no técnicos.

No deben mostrarse directamente:

- trazas;
- nombres internos;
- IDs técnicos;
- errores de Apps Script sin procesar.

---

## 36. ZONA HORARIA

Debes proponer y configurar correctamente la zona horaria oficial del proyecto.

Probablemente será:

**America/Santiago**

Debes confirmar esto en la auditoría.

---

## 37. ENTREGABLES DE LA AUDITORÍA

Antes de desarrollar, entrégame:

1. Resumen ejecutivo.
2. Interpretación funcional del sistema.
3. Contradicciones detectadas.
4. Vacíos detectados.
5. Riesgos funcionales.
6. Riesgos técnicos.
7. Limitaciones de Google Apps Script.
8. Mejoras obligatorias.
9. Mejoras recomendadas.
10. Mejoras opcionales.
11. Preguntas estrictamente necesarias, solo si existe un bloqueo real.
12. Arquitectura recomendada.
13. Modelo de datos propuesto.
14. Diagrama de relaciones.
15. Estructura de Google Sheets.
16. Estructura de carpetas y archivos.
17. Flujo de pantallas.
18. Flujo del asistente “Agregar producto nuevo”.
19. Flujo de borradores.
20. Flujo de descarte y recuperación.
21. Estrategia de imágenes.
22. Estrategia de PDF.
23. Estrategia de historial.
24. Estrategia de bloqueos.
25. Estrategia de acceso corporativo.
26. Estrategia responsive.
27. Estrategia de pruebas.
28. Criterios de aceptación.
29. Plan de migración entre ambientes.
30. Confirmación de que la base comenzará vacía.
31. Confirmación de que no modificarás proyectos anteriores.

---

## 38. FORMATO DE LAS MEJORAS PROPUESTAS

Para cada mejora propuesta debes indicar:

- Nombre de la mejora
- Problema que resuelve
- Beneficio
- Complejidad
- Impacto en el usuario
- Si es obligatoria, recomendada u opcional
- Si cambia algún requerimiento ya definido

No debes aplicar automáticamente cambios funcionales.

Primero debes presentarlos para aprobación.

---

## 39. PLAN DE DESARROLLO

Después de que yo apruebe la auditoría y las mejoras, debes crear un plan de desarrollo por fases.

Como mínimo, el plan debe considerar:

- Fase 0: preparación del proyecto
- Fase 1: modelo de datos
- Fase 2: seguridad y acceso
- Fase 3: catálogos
- Fase 4: configuración dinámica
- Fase 5: asistente de creación
- Fase 6: borradores
- Fase 7: ficha de consulta
- Fase 8: imágenes
- Fase 9: historial
- Fase 10: PDF
- Fase 11: responsive y diseño
- Fase 12: pruebas
- Fase 13: despliegue
- Fase 14: documentación

Puedes reorganizar estas fases si propones una estructura mejor.

Cada fase deberá incluir:

- objetivo;
- alcance;
- archivos afectados;
- tareas;
- dependencias;
- riesgos;
- pruebas;
- criterios de aceptación;
- resultado esperado.

---

## 40. DOCUMENTACIÓN

Debes proponer y mantener archivos como:

- README.md
- PLAN_DESARROLLO.md
- ARQUITECTURA.md
- MODELO_DATOS.md
- REGLAS_NEGOCIO.md
- SEGURIDAD.md
- PRUEBAS.md
- CAMBIOS.md
- DESPLIEGUE.md

---

## 41. REGLA FINAL

No comiences a programar todavía.

Primero:

1. Audita.
2. Propón mejoras.
3. Explica riesgos.
4. Espera mi decisión.
5. Estructura el plan definitivo.
6. Espera mi aprobación.
7. Solo entonces comienza el desarrollo por fases.

El sistema debe mantenerse simple para el usuario, aunque internamente tenga una arquitectura sólida.

No agregues complejidad sin una justificación clara.
