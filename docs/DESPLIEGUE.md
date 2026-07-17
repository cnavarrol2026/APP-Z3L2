# Despliegue

## Desarrollo local

Usar `clasp` con raíz `src`.

```powershell
clasp login
clasp create --type webapp --title "Estándar de Configuración Zona 3 Línea 2" --rootDir src
clasp push
```

## Preparación en Google

1. Crear Google Sheets nuevo.
2. Crear carpeta Drive para imágenes.
3. Crear carpeta Drive para respaldos.
4. Configurar IDs en `Config.gs`.
5. Ejecutar `setupDatabase()`.

## Pruebas

Usar la URL `/dev` para validar cambios recientes.

## Producción

Crear una versión Apps Script y desplegar URL `/exec` con acceso para usuarios autenticados con Google.

## Recursos corporativos creados

- Google Sheets: https://docs.google.com/spreadsheets/d/1vdFkhk0nGzlnX_aZ80l9hmSdHhD3_LSQOVBdXbURH6A/edit
- Apps Script: https://script.google.com/d/1mgAMib7TF1n0vjTiuAghftgrqVD-A2sLN5cGZcxoplLwYREKXHsuak2h/edit
- Web app inicial: https://script.google.com/macros/s/AKfycbyVNTQFjcytiBD-TtvkFmenqjmNqvV4aMVHSFYaF4GrztzxATuzKRRNvW4QMjZi15Q/exec

## Inicialización manual completada

Desde el editor Apps Script corporativo se ejecutaron correctamente:

- `INICIALIZAR_APP_Z3L2`
- `CREAR_CARPETAS_DRIVE_APP_Z3L2`
- `VER_CONFIG_APP_Z3L2`
