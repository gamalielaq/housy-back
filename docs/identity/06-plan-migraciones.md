# Plan de migraciones

Reglas:

- No usar `synchronize: true`.
- Usar TypeORM migrations.
- La migración actual de esta rama crea solamente tablas de identidad.
- La migración elimina tablas conocidas de negocio si existen en una base vieja.

Comandos:

```bash
npm.cmd run migration:run
npm.cmd run migration:revert
npm.cmd run typeorm -- schema:log
```

## Seed inicial de aplicación

Después de correr migraciones, crear o actualizar la aplicación cliente inicial con:

`ash
npm.cmd run seed:default-app
` 

El seed usa las variables:

- DEFAULT_APP_NAME 
- DEFAULT_APP_CODE 
- DEFAULT_APP_CLIENT_ID 
- DEFAULT_APP_CLIENT_SECRET 

El script es idempotente: si encuentra una aplicación por clientId o code, la actualiza en lugar de duplicarla.

