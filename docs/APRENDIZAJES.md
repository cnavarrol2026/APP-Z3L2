# Aprendizajes Operativos

## 2026-07-17 - Creación de recursos Google

### Situación

El usuario pidió que Codex se encargara de crear directamente los recursos de Google Sheets, Drive y Apps Script, sin dejar esa preparación manual al usuario.

### Decisión

Usar primero el conector de Google Drive para crear recursos nativos cuando esté disponible:

1. Crear Google Sheets nativo.
2. Crear carpetas Drive para imágenes y respaldos.
3. Crear pestañas y encabezados con `batchUpdate`.
4. Configurar zona horaria del spreadsheet en `America/Santiago`.
5. Registrar los IDs reales en `src/Config.gs`.

### Resultado inicial

- Spreadsheet creado: `APP-Z3L2 - Base de Datos`.
- Carpeta creada: `APP-Z3L2 - Imágenes`.
- Carpeta creada: `APP-Z3L2 - Respaldos`.
- No se cargaron datos de ejemplo.

### Corrección posterior

El usuario detectó a tiempo que esos recursos se estaban creando con la cuenta Gmail, pero el proyecto debe vivir en la cuenta corporativa `cnavarrol@vspt.cl`, igual que el proyecto anterior de mermas.

Acción tomada:

1. Detener el avance antes de crear Apps Script.
2. Eliminar el Sheet y las dos carpetas Drive creadas por error.
3. Retirar los IDs de Gmail desde `src/Config.gs`.
4. Dejar placeholders corporativos explícitos.

### Aprendizaje actualizado

Para proyectos Apps Script nuevos, conviene crear primero los recursos con el conector de Google Drive y solo después usar `clasp`. Así se evita depender de `setupDatabase()` para la primera materialización de hojas y se llega a Apps Script con IDs reales ya definidos.

Pero antes de crear cualquier recurso Google, hay que validar la identidad propietaria activa. Si el proyecto debe quedar en una cuenta corporativa, confirmar que el conector de Drive y `clasp` estén autenticados con esa cuenta antes de crear Sheets, carpetas o Apps Script.

Si se crean recursos en la cuenta equivocada, corregir temprano es simple: eliminar recursos y recrear desde la cuenta correcta. Corregir tarde puede ser complejo, especialmente con Apps Script.

### Ruta recomendada si el conector Drive está en otra cuenta

Si `clasp show-authorized-user` confirma la cuenta corporativa, pero el conector Drive está autenticado con Gmail, crear los recursos desde Apps Script:

1. Crear proyecto Apps Script con `clasp create`.
2. Subir una función de bootstrap.
3. Ejecutar el bootstrap con `clasp run`.
4. Validar que la función detenga la ejecución si el usuario activo no es `cnavarrol@vspt.cl`.
5. Copiar los IDs resultantes a `src/Config.gs`.

### Bloqueo con `clasp create --type webapp`

En `clasp` 3.3.0, el intento:

```powershell
clasp.cmd create --type webapp --title "APP-Z3L2 - Estándar de Configuración Zona 3 Línea 2" --rootDir src
```

respondió:

```text
Invalid container file type
```

Solución: crear el proyecto como `standalone` y desplegarlo después como web app.

### `clasp create` reemplaza `appsscript.json`

Después de crear el proyecto standalone, `clasp` dejó `src/appsscript.json` con `America/New_York` y sin scopes personalizados. Hay que revisar y restaurar el manifiesto antes del primer `clasp push`.

### `.claspignore` con `rootDir: src`

El primer `clasp push --force` respondió `Script is already up to date`, y `clasp status` mostró `src\` como untracked. Causa: `.claspignore` estaba escrito como si la raíz fuera el repositorio, pero `.clasp.json` define `rootDir: src`.

Solución: usar patrones relativos a `src`:

```text
**/**
!*.gs
!*.html
!appsscript.json
```

### `clasp run` requiere API executable

Después del `clasp push`, el intento:

```powershell
clasp.cmd run bootstrapCorporateResources
```

respondió:

```text
Script function not found. Please make sure script is deployed as API executable.
```

Aprendizaje: para ejecutar funciones remotas desde `clasp run`, no basta con subir el código; hay que habilitar o desplegar el script como API executable, o usar otra ruta de ejecución.

Se agregó `executionApi.access = MYSELF` al manifiesto para probar ejecución remota controlada solo por el propietario.

Resultado posterior:

- `clasp deploy --description "Bootstrap API temporal"` creó un despliegue.
- `clasp run setupDatabase` respondió: `Unable to run script function. Please make sure you have permission to run the script function.`

Conclusión: el bloqueo persiste en el canal de ejecución remota de `clasp`; no es un problema de que el código no esté subido.

### Google bloquea la reautorización amplia de `clasp`

Al intentar reautorizar `clasp` con scopes completos del proyecto (`spreadsheets`, `drive`, `documents`, `cloud-platform`, etc.), Google mostró:

```text
Se bloqueó esta app
La app intentó acceder a información sensible de tu Cuenta de Google.
Para proteger la cuenta, Google bloqueó este acceso.
```

Causa probable: la cuenta corporativa `cnavarrol@vspt.cl` pertenece a Google Workspace y la organización bloquea apps OAuth no verificadas o flujos OAuth con permisos sensibles/amplios. En este caso, el cliente OAuth usado por `clasp` es el cliente genérico de la CLI, no una app aprobada por VSPT.

Aprendizaje: si aparece este bloqueo, no insistir con más reintentos de login de `clasp` con scopes amplios. Las rutas más seguras son:

1. Usar el editor web de Apps Script con la cuenta corporativa para ejecutar una función de inicialización y autorizar el script propio.
2. Crear/aprobar un OAuth Client corporativo en Google Cloud y usarlo con `clasp login --creds`.
3. Conectar el plugin/conector de Google Drive directamente con `cnavarrol@vspt.cl`, si la plataforma lo permite.

Ruta recomendada para este proyecto: abrir el Apps Script ya creado con la cuenta corporativa, ejecutar `setupDatabase()` desde el editor, autorizar el script propio y luego continuar con `clasp push/deploy`.

### Borrado de Apps Script con `clasp delete`

Al intentar eliminar el script standalone creado temporalmente, `clasp delete --force` respondió que la app OAuth de `clasp` no tenía permiso de escritura sobre el archivo. Ese script no contiene datos productivos, pero queda como recurso a revisar/eliminar manualmente desde la cuenta corporativa si aparece en Drive/Apps Script.

Para evitar depender de `clasp run` para crear recursos, se prefiere crear el proyecto definitivo como tipo `sheets`, de modo que `clasp` cree una hoja Google corporativa y un proyecto Apps Script ligado.

### Variante de autorización menos bloqueante

El comando:

```powershell
clasp.cmd login --no-localhost --use-project-scopes
```

genera una URL con menos scopes:

- `userinfo.email`
- `spreadsheets`
- `drive`
- `documents`

Esta variante evita agregar `cloud-platform` y los scopes internos de despliegue de `clasp`, por lo que es el siguiente intento recomendado si Google Workspace bloquea la autorización amplia.

Resultado real en cuenta corporativa: la URL reducida también fue bloqueada por Google. Conclusión definitiva: el bloqueo no depende solo de scopes excesivos; la organización también bloquea el cliente OAuth genérico de `clasp` para estos permisos sensibles.

No seguir intentando reautorizar `clasp` con el cliente OAuth por defecto. La salida práctica es ejecutar la primera autorización desde el editor web de Apps Script o usar un OAuth Client corporativo aprobado por VSPT.

### Funciones visibles para inicialización manual

Si el editor de Apps Script no muestra `setupDatabase` en el selector de funciones, agregar un archivo dedicado con funciones de nombre explícito:

- `INICIALIZAR_APP_Z3L2`
- `CREAR_CARPETAS_DRIVE_APP_Z3L2`

Después de `clasp push --force`, recargar el editor de Apps Script para refrescar el selector de funciones.

### Inicialización manual confirmada

El usuario ejecutó desde el editor Apps Script corporativo:

- `INICIALIZAR_APP_Z3L2`
- `CREAR_CARPETAS_DRIVE_APP_Z3L2`
- `VER_CONFIG_APP_Z3L2`

Las ejecuciones completaron correctamente. Después de eso, `clasp deploy` permitió crear el despliegue web inicial.

### Pantalla "Google no ha verificado esta aplicación"

La pantalla de advertencia pertenece a Google OAuth y no se puede personalizar desde HTML, CSS ni Apps Script.

Para reducir la fricción inicial, se cambió el manifiesto a scopes mínimos:

- `userinfo.email`
- `spreadsheets.currentonly`

Se dejaron fuera del primer inicio los scopes de Drive y Documents. Esto posterga funciones de imágenes, respaldos y PDF hasta una autorización posterior o hasta configurar OAuth corporativo verificado.

Aprendizaje: para una primera entrada de usuario, pedir solo permisos mínimos. Agregar Drive/PDF más adelante cuando la pantalla principal ya esté validada o cuando TI apruebe un OAuth Client corporativo.

### Bucle de autorización en web app

Si el despliegue queda con:

```json
"executeAs": "USER_ACCESSING"
```

cada usuario debe autorizar los permisos del script, lo que en cuentas Workspace puede generar un bucle de autorización/unverified app muy mala experiencia.

Para una aplicación administrada por un propietario corporativo, usar:

```json
"executeAs": "USER_DEPLOYING"
```

Así el script accede a Sheets/Drive con la cuenta propietaria del despliegue y el usuario final solo entra con Google. La auditoría de usuario debe seguir intentando leer `Session.getActiveUser().getEmail()`, pero el acceso a datos no depende de permisos individuales del usuario.

### `Session.getActiveUser().getEmail()` vacío con `USER_DEPLOYING`

Al cambiar el despliegue para ejecutar como propietario, la interfaz cargó, pero el backend bloqueó con:

```text
No fue posible identificar tu cuenta Google.
```

Causa: en despliegues Apps Script ejecutados como propietario, `Session.getActiveUser().getEmail()` puede venir vacío según el contexto de acceso y políticas de Workspace.

Solución aplicada: no bloquear el ingreso si el correo viene vacío. Usar un usuario técnico visible como `Usuario Google` y conservar auditoría con `usuario.google.no.identificado` hasta que se defina una estrategia de identidad más estricta.

### Base vacía no significa ficha sin estructura

La decisión de iniciar con base vacía aplica a productos, artículos, categorías operativas, botellas reales y valores técnicos. No debe dejar vacía la plantilla estructural de la ficha.

Para que la aplicación sea entendible desde el primer acceso, conviene precargar de forma idempotente:

- secciones base de la ficha técnica;
- campos dinámicos esperados;
- unidades mínimas necesarias.

Eso no contamina la base con datos de ejemplo, porque solo crea la estructura de captura. Los valores de cada artículo siguen naciendo vacíos.

### Evitar dependencias de carga en constantes globales de Apps Script

En Apps Script, los archivos `.gs` no deben depender de que otro archivo ya haya inicializado sus constantes al momento de evaluar objetos globales.

Problema detectado:

```js
const TemplateService = {
  DEFAULT_SECTIONS: [
    { tipo: Config.FIELD_TYPES.TEXT }
  ]
};
```

Si `TemplateService.gs` se evalúa antes que `Config.gs`, la carga inicial puede fallar y la interfaz queda sin datos.

Solución aplicada: usar valores literales estables (`TEXTO`, `NUMERO`) dentro de la plantilla global, y reservar `Config` para ejecución de funciones donde ya está disponible.

### Configuración debe separar tareas, no apilar formularios

La pantalla de Configuración se volvió confusa al mezclar en una sola vista:

- plantilla de ficha técnica;
- catálogos;
- creación de campos;
- creación de producto;
- pendientes;
- descartados;
- respaldo.

Solución aplicada: usar pestañas horizontales internas dentro de Configuración. Cada pestaña debe representar una tarea clara y mostrar solo los controles necesarios para esa tarea.

### Producto nuevo debe mostrar el esqueleto de ficha, no campos sueltos

El alta de producto no es solo código, descripción e imagen. Para este proyecto, el usuario espera ver la ficha técnica armada y rellenarla desde el mismo flujo.

Decisiones aplicadas:

- ocultar `Etapa` porque es un estado técnico interno del borrador;
- separar ETQ y CET en bloques visuales propios;
- mostrar imagen ETQ e imagen CET como controles separados;
- renderizar las secciones y campos de la ficha dentro de Producto nuevo;
- guardar los valores capturados dentro del `payloadJson` del borrador mientras se completa la persistencia vertical definitiva.

### Fallos de carga inicial deben verse en todas las páginas

Si `apiGetInitialData` falla o tarda demasiado, no basta con mostrar el error en una sola pestaña. El usuario puede estar en Producto nuevo, Catálogos o Pendientes y pensar que la app está vacía.

Solución aplicada: avisos visibles de carga lenta o error de backend en todas las páginas internas de Configuración.

### La carga inicial de Apps Script debe ser solo lectura mínima

Apps Script puede sentirse congelado si la primera llamada de la web app intenta hacer demasiadas cosas: validar/crear hojas, escribir plantilla, leer historial, leer borradores y armar toda la app en una sola ejecución.

Regla aplicada desde ahora:

- la carga inicial solo lee lo mínimo para pintar la pantalla;
- no debe llamar `ensureDatabase`;
- no debe escribir plantilla en Sheets;
- no debe leer historial completo al inicio;
- debe usar una plantilla fallback en memoria si las hojas aún no tienen estructura;
- el frontend debe tener timeout para no quedar esperando indefinidamente.

### La interfaz no debe depender de Sheets para existir

Si el usuario entra a la app y Google Sheets tarda, falla o pide autorización, la pantalla no puede quedar vacía ni bloqueada. Para este proyecto, el esqueleto visual de la ficha debe renderizarse localmente primero, y la sincronización con Sheets debe ocurrir después.

Cambio aplicado:

- render local inmediato de la plantilla técnica;
- estado superior claro como `Esqueleto listo`, `Datos sincronizados` o `Datos no disponibles`;
- aviso global visible cuando Sheets tarda o falla;
- cambio de scope desde `spreadsheets.currentonly` a `spreadsheets` para evitar que la web app dependa del contexto de hoja activa.

### No mostrar términos técnicos internos en la interfaz

Términos como `Modo local`, `borrador` o `etapa` pueden ser correctos internamente, pero confunden al usuario operativo. En la UI deben mostrarse acciones y estados entendibles:

- `Esqueleto listo`;
- `Datos sincronizados`;
- `Datos no disponibles`;
- `Guardar producto`.

El modelo interno puede seguir usando borradores y etapas para control técnico, pero esos conceptos no deben dominar la experiencia principal.

### Diagnosticar Apps Script antes de seguir cambiando UI

Cuando una web app queda esperando datos, no conviene seguir mezclando UI con lectura de Sheets. Hay que separar:

- `apiPing`: confirma que Apps Script y `google.script.run` responden sin tocar Sheets;
- `apiCheckSheets`: confirma que el script puede abrir la hoja vinculada;
- `apiGetInitialData`: carga datos reales solo después de que lo anterior funcione.

Esto permite saber si el bloqueo está en el despliegue/Apps Script, en la autorización de Sheets o en la lectura de datos.

### `google.script.run` puede devolver errores sin forma estándar

La consola mostró:

```text
Cannot read properties of null (reading 'message')
```

Eso ocurrió porque el frontend asumía que toda respuesta fallida tenía `.message`. En Apps Script, una llamada puede fallar o devolver `null`/objetos no estándar, y el manejador debe ser defensivo.

Solución aplicada:

- función `getErrorMessage(error, fallback)`;
- validación de `response` antes de leer `response.message`;
- mensajes fallback por función;
- `apiCheckSheets` con error explícito si no puede abrir el Spreadsheet.

### Comparación inicial con Mermas

Se revisó Mermas solo en lectura. Su manifiesto usa:

- `spreadsheets`;
- `userinfo.email`;
- `script.container.ui`;
- `script.external_request`;
- `executeAs: USER_DEPLOYING`;
- `access: ANYONE`.

APP-Z3L2 ya quedó alineado al menos en `spreadsheets`, `USER_DEPLOYING` y `ANYONE`. La diferencia del banner superior de Google no parece venir del HTML; queda pendiente comparar el despliegue publicado exacto y el comportamiento de la URL final.
