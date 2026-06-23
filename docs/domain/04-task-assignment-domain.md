# Task assignment domain

Task assignments are generated from active tasks and task rotations.

## Entity

`TaskAssignment` stores:

- `id`
- `taskId`
- `familyMemberId`
- `startDate`
- `endDate`
- `status`
- `completedAt`
- `createdAt`

## Statuses

- `pending`
- `completed`
- `skipped`

## API

- `POST /task-assignments/generate`
- `GET /task-assignments`
- `GET /task-assignments/current`
- `GET /task-assignments/:id`
- `PATCH /task-assignments/:id/complete`

## Generation

Generation receives `familyId`, `startDate`, `endDate`, and optional `taskId`.
It creates pending assignments for matching task dates and rotates through the
configured task members.

## History

Completing an assignment writes a `TaskHistory` record with:

- `taskAssignmentId`
- `completedBy`
- `completedAt`
- `notes`
