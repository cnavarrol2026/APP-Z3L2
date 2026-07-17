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
