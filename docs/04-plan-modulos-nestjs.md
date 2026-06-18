# Plan de módulos NestJS

El backend se dividirá en módulos por dominio. La regla: cada módulo debe tener una responsabilidad clara y no mezclar lógica de otros dominios.

## `config`

Responsabilidad:

- Cargar variables de entorno.
- Validar configuración requerida.
- Exponer configuración de base de datos.

Archivos esperados:

- `config/env.validation.ts`
- `config/database.config.ts`

Endpoints: ninguno.

## `database`

Responsabilidad:

- Configurar TypeORM.
- Centralizar conexión MySQL.
- Exponer configuración para migraciones.

Archivos esperados:

- `database/database.module.ts`
- `database/data-source.ts`
- `database/migrations/`

Endpoints: ninguno.

## `users`

Responsabilidad:

- Administrar miembros de la familia.

Controller:

- `UsersController`

Service:

- `UsersService`

Entities:

- `User`

DTOs:

- `CreateUserDto`
- `UpdateUserDto`

Endpoints aproximados:

- `POST /users`
- `GET /users`
- `GET /users/:id`
- `PATCH /users/:id`
- `DELETE /users/:id` o desactivación lógica.

## `task-categories`

Responsabilidad:

- Administrar categorías de tareas.

Controller:

- `TaskCategoriesController`

Service:

- `TaskCategoriesService`

Entities:

- `TaskCategory`

DTOs:

- `CreateTaskCategoryDto`
- `UpdateTaskCategoryDto`

Endpoints aproximados:

- `POST /task-categories`
- `GET /task-categories`
- `GET /task-categories/:id`
- `PATCH /task-categories/:id`
- `DELETE /task-categories/:id`

## `tasks`

Responsabilidad:

- Administrar definición de tareas recurrentes.

Controller:

- `TasksController`

Service:

- `TasksService`

Entities:

- `Task`

DTOs:

- `CreateTaskDto`
- `UpdateTaskDto`

Endpoints aproximados:

- `POST /tasks`
- `GET /tasks`
- `GET /tasks/:id`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id` o desactivación lógica.

## `task-rotations`

Responsabilidad:

- Configurar miembros y orden de rotación por tarea.

Controller:

- `TaskRotationsController`

Service:

- `TaskRotationsService`

Entities:

- `TaskRotationMember`

DTOs:

- `SetTaskRotationDto`
- `TaskRotationMemberDto`
- `UpdateTaskRotationDto`

Endpoints aproximados:

- `PUT /tasks/:taskId/rotation`
- `GET /tasks/:taskId/rotation`
- `DELETE /tasks/:taskId/rotation/:userId`

## `task-assignments`

Responsabilidad:

- Generar asignaciones.
- Consultar asignaciones por semana.
- Cambiar estados.
- Registrar historial.

Controller:

- `TaskAssignmentsController`

Service:

- `TaskAssignmentsService`

Entities:

- `TaskAssignment`
- `TaskAssignmentLog`

DTOs:

- `GenerateAssignmentsDto`
- `ListAssignmentsQueryDto`
- `CompleteAssignmentDto`
- `SkipAssignmentDto`

Endpoints aproximados:

- `POST /task-assignments/generate`
- `GET /task-assignments`
- `PATCH /task-assignments/:id/complete`
- `PATCH /task-assignments/:id/skip`
- `GET /task-assignments/:id/logs`
