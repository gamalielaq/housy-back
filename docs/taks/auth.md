# Identity API - Future Roadmap

## Contexto

Actualmente la Identity API ya dispone de:

* Registro de usuarios.
* Inicio de sesión.
* Refresh token.
* Logout.
* Gestión de aplicaciones.
* Gestión de sesiones.

Por el momento esto es suficiente para comenzar a integrar aplicaciones como:

* Turnly
* Restaurant API
* Otras aplicaciones futuras

No es necesario implementar todavía las funcionalidades descritas en este documento.

---

# Fase 1 - Gestión de cuenta

## Change Password

Endpoint:

```txt
POST /auth/change-password
```

Objetivo:

* Cambiar contraseña.
* Revocar sesiones activas.
* Obligar al usuario a iniciar sesión nuevamente.

---

## Revoke All Sessions

Endpoint:

```txt
POST /sessions/revoke-all
```

Objetivo:

* Cerrar sesión en todos los dispositivos.

---

# Fase 2 - Verificación de correo

Nueva tabla:

```txt
email_verification_tokens
```

Endpoints:

```txt
POST /auth/send-verification-email

POST /auth/verify-email
```

Campo asociado:

```txt
users.email_verified
```

---

# Fase 3 - Recuperación de contraseña

Nueva tabla:

```txt
password_reset_tokens
```

Endpoints:

```txt
POST /auth/forgot-password

POST /auth/reset-password
```

---

# Fase 4 - Auditoría

Nueva tabla:

```txt
audit_logs
```

Eventos:

* LOGIN_SUCCESS
* LOGIN_FAILED
* REFRESH_TOKEN
* LOGOUT
* CHANGE_PASSWORD
* VERIFY_EMAIL
* FORGOT_PASSWORD
* RESET_PASSWORD

Objetivo:

Mantener trazabilidad completa de eventos importantes.

---

# Fase 5 - Roles

Nueva tabla:

```txt
roles
```

Tabla de relación:

```txt
user_application_roles
```

Ejemplos:

Turnly:

* owner
* member

Restaurant:

* admin
* waiter
* cashier
* kitchen

---

# Fase 6 - Permisos

Nueva tabla:

```txt
permissions
```

Ejemplos:

```txt
products.read
products.create
products.update

orders.read
orders.create

reports.export
```

Tabla relación:

```txt
role_permissions
```

Objetivo:

Implementar RBAC.

---

# Fase 7 - API Keys

Nueva tabla:

```txt
api_keys
```

Endpoints:

```txt
POST /api-keys

GET /api-keys

DELETE /api-keys/:id
```

Objetivo:

Autenticación entre servicios.

---

# Fase 8 - Notificaciones

Tabla:

```txt
notifications
```

Proveedor futuro:

* SMTP
* Resend
* Mailgun

Objetivo:

* Verificación de correo.
* Recuperación de contraseña.
* Alertas.

---

# Fase 9 - SDK

Paquetes futuros:

```txt
@gamaliel/auth-angular

@gamaliel/auth-nest
```

Objetivo:

Reutilizar autenticación entre aplicaciones.

---

# Fase 10 - Docker

docker-compose:

* identity-api
* mysql

Objetivo:

Despliegue sencillo.

---

# Fase 11 - CI/CD

Github Actions:

* test
* lint
* build
* docker build
* deploy

---

# Prioridad actual

NO implementar estas funcionalidades todavía.

La prioridad es:

1. Register.
2. Login.
3. Refresh Token.
4. Logout.
5. Integrar aplicaciones externas.
6. Validar JWT en otros servicios.
7. Construir dominio de negocio.

Estas funcionalidades se implementarán posteriormente cuando la Identity API esté estable.
