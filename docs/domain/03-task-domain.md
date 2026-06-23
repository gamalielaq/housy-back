# Task domain

Tasks, categories, and rotations are scoped by family.

## TaskCategory

`TaskCategory` belongs to one family and has a unique name inside that family.

Endpoints:

- `POST /task-categories`
- `GET /task-categories`
- `GET /task-categories/:id`
- `PATCH /task-categories/:id`
- `DELETE /task-categories/:id`

## Task

`Task` belongs to one family and may belong to one category from the same family.

Endpoints:

- `POST /tasks`
- `GET /tasks`
- `GET /tasks/:id`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`

## TaskRotation

A task rotation defines which family members receive generated assignments.

Endpoints:

- `PUT /tasks/:taskId/rotation`
- `GET /tasks/:taskId/rotation`
- `DELETE /tasks/:taskId/rotation/:familyMemberId`

## Rules

- Rotation members must be active family members.
- Rotation members must belong to the same family as the task.
- Rotation positions must be unique per task.
