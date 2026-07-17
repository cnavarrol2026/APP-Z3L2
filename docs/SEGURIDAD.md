# Seguridad

## Acceso

El despliegue debe exigir autenticación Google. No se filtra por dominio ni lista de correos, según decisión aprobada.

## Backend

Cada función pública debe llamar a `SecurityService.requireAuthenticatedUser()`.

Si Apps Script no entrega correo del usuario, la operación queda bloqueada con un mensaje claro.

## Datos

- No se confía en valores del navegador.
- Se validan IDs, estados, tipos y tamaños en backend.
- Se escapa texto antes de renderizarlo.
- No se exponen trazas técnicas al usuario.

## Archivos

- Solo PNG.
- Máximo 1 MB.
- El nombre se sanitiza antes de subir a Drive.
