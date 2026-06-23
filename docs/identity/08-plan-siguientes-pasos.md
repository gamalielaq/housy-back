# Plan de siguientes pasos para `identity_auth`

Esta base ya quedó limpia de negocio. El siguiente objetivo es convertirla en una API de identidad segura, testeable y lista para reutilizarse desde varias aplicaciones.

## Estado actual

Ya existe:

- `auth`: register, login, refresh, logout, me.
- `users`: usuario identity neutro.
- `applications`: aplicaciones cliente por `clientId`.
- `sessions`: sesiones y revocación.
- JWT access token.
- Refresh token hasheado.
- Migración limpia de identity/auth.

No existe todavía:

- Guards por rol/permisos.
- Protección real de endpoints administrativos.
- Tests e2e completos de auth.
- Seed inicial de aplicaciones.
- Rate limit / anti brute-force.
- Recuperación y cambio de contraseña.
- Verificación de email.
- Docker/README operativo final.

## Camino recomendado

Primero cerrar seguridad mínima, después experiencia operativa, y recién después features avanzadas. No conviene agregar recuperación de contraseña o Google Login si todavía `/applications` y `/sessions` no están protegidos. Eso sería decorar una puerta sin cerradura.

## Fase 1: Seguridad base de endpoints

Objetivo: que la API no exponga administración sin autenticación.

Checklist:

- [x] Proteger `GET /auth/me` con JWT.
- [x] Proteger `POST /applications`.
- [x] Proteger `GET /applications`.
- [x] Proteger `GET /applications/:id`.
- [x] Proteger `GET /sessions`.
- [x] Proteger `POST /sessions/:id/revoke`.
- [x] Crear decorator `@CurrentUser()`.
- [x] Crear guard/logic de roles por aplicación.
- [x] Definir rol mínimo para administrar aplicaciones y sesiones.

Resultado esperado:

```txt
Los endpoints sensibles requieren JWT válido y rol autorizado.
```

## Fase 2: Normalizar respuestas y errores

Objetivo: que el frontend consuma respuestas consistentes.

Checklist:

- [ ] Definir formato estándar de éxito.
- [ ] Definir formato estándar de error.
- [ ] Crear interceptor de respuesta si aporta valor.
- [ ] Revisar mensajes de error de auth.
- [ ] Evitar filtrar detalles sensibles: email existe, password incorrecta, token inválido.
- [ ] Documentar ejemplos de response.

Formato sugerido:

```json
{
  "data": {},
  "message": "Optional message"
}
```

## Fase 3: Tests e2e de autenticación

Objetivo: proteger el comportamiento crítico antes de crecer.

Checklist:

- [ ] Test `POST /applications`.
- [ ] Test `POST /auth/register`.
- [ ] Test `POST /auth/login`.
- [ ] Test login con password incorrecta.
- [ ] Test login con `clientId` inválido.
- [ ] Test usuario sin acceso a aplicación.
- [ ] Test `POST /auth/refresh` rota refresh token.
- [ ] Test refresh token reutilizado falla.
- [ ] Test `POST /auth/logout` revoca sesión.
- [ ] Test `GET /auth/me` con y sin token.

Resultado esperado:

```txt
El flujo completo application -> register -> login -> me -> refresh -> logout queda cubierto.
```

## Fase 4: Seed inicial de aplicaciones

Objetivo: no depender de crear aplicaciones manualmente en cada entorno.

Checklist:

- [x] Definir estrategia: seed script o migration seed.
- [x] Crear aplicación inicial desde variables `.env`.
- [ ] Variables sugeridas:
  - `DEFAULT_APP_NAME`
  - `DEFAULT_APP_CODE`
  - `DEFAULT_APP_CLIENT_ID`
  - `DEFAULT_APP_CLIENT_SECRET`
- [x] Hashear `clientSecret` si se usa.
- [x] Documentar cómo crear una nueva aplicación cliente.

Resultado esperado:

```txt
Un entorno nuevo puede arrancar con una aplicación cliente lista para login/register.
```

## Fase 5: Endurecer sesiones y refresh tokens

Objetivo: mejorar seguridad sin complicar de más.

Checklist:

- [ ] Guardar `ipAddress` y `userAgent` correctamente.
- [ ] Listar sesiones por usuario actual, no globalmente.
- [ ] Revocar sesión propia.
- [ ] Revocar todas las sesiones del usuario.
- [ ] Revocar todas las sesiones de una aplicación.
- [ ] Agregar índice a `refresh_tokens.token_hash`.
- [ ] Agregar limpieza de tokens expirados.

Endpoints sugeridos:

```txt
GET  /sessions/me
POST /sessions/:id/revoke
POST /sessions/revoke-all
```

## Fase 6: Perfil y cambio de contraseña

Objetivo: permitir mantenimiento básico de cuenta.

Checklist:

- [ ] `GET /users/me` o mantener `GET /auth/me` enriquecido.
- [ ] `PATCH /users/me` para cambiar nombre.
- [ ] `POST /auth/change-password`.
- [ ] Validar contraseña actual.
- [ ] Hashear nueva contraseña.
- [ ] Revocar refresh tokens después del cambio.

Resultado esperado:

```txt
El usuario puede administrar datos básicos y cambiar contraseña de forma segura.
```

## Fase 7: Recuperación de contraseña

Objetivo: preparar recuperación sin acoplarse todavía a un proveedor de email específico.

Checklist:

- [ ] Crear tabla `password_reset_tokens`.
- [ ] Guardar token hasheado.
- [ ] Expiración corta.
- [ ] Uso único.
- [ ] `POST /auth/forgot-password`.
- [ ] `POST /auth/reset-password`.
- [ ] Crear abstracción `MailService` o dejar evento/log para MVP.

Resultado esperado:

```txt
La API soporta recuperación de contraseña sin guardar tokens en texto plano.
```

## Fase 8: Verificación de email

Objetivo: mejorar confianza de cuentas sin bloquear el MVP si no hace falta.

Checklist:

- [ ] Crear tabla `email_verification_tokens` o reutilizar mecanismo tokenizado.
- [ ] `POST /auth/resend-verification`.
- [ ] `POST /auth/verify-email`.
- [ ] Marcar `users.emailVerified = true`.
- [ ] Decidir si login requiere email verificado por aplicación.

Resultado esperado:

```txt
El sistema puede exigir email verificado cuando una aplicación lo necesite.
```

## Fase 9: Rate limit y anti brute-force

Objetivo: reducir ataques básicos a login y refresh.

Checklist:

- [ ] Instalar/configurar throttling de NestJS.
- [ ] Rate limit para `/auth/login`.
- [ ] Rate limit para `/auth/refresh`.
- [ ] Rate limit para recuperación de contraseña.
- [ ] Registrar intentos fallidos básicos.
- [ ] Evaluar bloqueo temporal por usuario/aplicación.

Resultado esperado:

```txt
Login y recuperación no quedan abiertos a fuerza bruta simple.
```

## Fase 10: Documentación operativa y despliegue

Objetivo: que el proyecto pueda moverse a `identity-api` sin depender de memoria tribal.

Checklist:

- [ ] Crear README principal de Identity API.
- [ ] Documentar `.env.example` completo.
- [ ] Documentar comandos:
  - instalar dependencias;
  - correr dev;
  - correr migraciones;
  - correr tests.
- [ ] Agregar Dockerfile si aplica.
- [ ] Agregar `docker-compose.yml` para MySQL si aplica.
- [ ] Documentar Swagger `/api`.
- [ ] Documentar cómo registrar una aplicación cliente.

Resultado esperado:

```txt
Un dev nuevo puede levantar identity_auth sin preguntarte nada.
```

## Orden de ejecución sugerido

1. Fase 1: Seguridad base de endpoints.
2. Fase 3: Tests e2e de autenticación.
3. Fase 4: Seed inicial de aplicaciones.
4. Fase 5: Endurecer sesiones y refresh tokens.
5. Fase 6: Perfil y cambio de contraseña.
6. Fase 7: Recuperación de contraseña.
7. Fase 8: Verificación de email.
8. Fase 9: Rate limit.
9. Fase 10: Documentación/despliegue.

La Fase 2 puede hacerse en paralelo con Fase 1 o Fase 3.

## Próxima acción recomendada

Ejecutar primero:

```txt
Fase 1: Seguridad base de endpoints
```

Porque ahora la API ya autentica, pero todavía falta cerrar la administración. Primero cerramos puertas; después agregamos muebles.

## Estado Fase 1

Implementado:

- @CurrentUser() para leer el JWT payload actual.
- @ApplicationRoles() para declarar roles requeridos.
- ApplicationRolesGuard para validar rol de aplicación.
- /applications requiere owner.
- /sessions requiere owner o dmin.
- GET /auth/me usa @CurrentUser() sobre JWT.

Nota: al proteger POST /applications, el primer bootstrap queda para la Fase 4 mediante seed inicial de aplicación.


## Estado Fase 4

Implementado:

- Script 
pm.cmd run seed:default-app.
- Seed idempotente en src/database/seeds/default-application.seed.ts.
- Variables DEFAULT_APP_NAME, DEFAULT_APP_CODE, DEFAULT_APP_CLIENT_ID, DEFAULT_APP_CLIENT_SECRET.
- Si la aplicación existe por clientId o code, se actualiza; si no existe, se crea.
- DEFAULT_APP_CLIENT_SECRET se hashea con bcrypt cuando está presente.

Uso:

`ash
npm.cmd run seed:default-app
` 

Valores por defecto:

`	xt
DEFAULT_APP_NAME=Identity Web
DEFAULT_APP_CODE=identity
DEFAULT_APP_CLIENT_ID=identity-web
DEFAULT_APP_CLIENT_SECRET=
` 

