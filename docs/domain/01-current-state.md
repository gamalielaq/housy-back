# Current backend state before frontend integration

Turnly is now a business-domain API. Authentication and identity ownership belong to
`identity-api`; Turnly should only store business references such as
`identityUserId` on family members.

## Quick status

| Area | Current state | Gap before frontend |
|------|---------------|---------------------|
| Families | Missing module/entity/table | Required before stable family-scoped APIs |
| FamilyMembers | Exists with `identityUserId`, `familyId`, `displayName`, `role`, `status` | Needs real `Family` relation once `families` exists |
| TaskCategories | Exists as global categories | Needs `familyId` and `Family` relation |
| Tasks | Exists as global tasks with optional category | Needs `familyId` and `Family` relation |
| TaskRotations | Exists for task rotation membership | Coherent with `FamilyMember`, but depends on family-scoped data |
| TaskAssignments | Entity exists only | Missing module, service, controller, generation flow, and target API contract |
| TaskHistory | Missing | Required for completion history queries |
| MyTasks | Missing | Requires future authenticated identity context |
| Dashboard | Missing | Requires assignment/history data |
| Reports | Missing | Requires assignment/history data |
| Notifications | Missing | Can be prepared without push notifications |
| Settings | Missing | Needs domain decision: global, family-level, or member-level settings |

## Existing modules

### `family-members`

Current API:

- `POST /family-members`
- `GET /family-members`
- `GET /family-members/:id`
- `PATCH /family-members/:id`
- `DELETE /family-members/:id`

Entity fields:

- `id`
- `identityUserId`
- `familyId`
- `displayName`
- `role`
- `status`
- `createdAt`
- `updatedAt`

Assessment:

- OK: Does not store password, email, refresh token, or local auth data.
- OK: Uses `identityUserId` as external Identity API reference.
- Risk: `familyId` is currently only a scalar column, not a foreign key, because
  `families` does not exist yet.

### `task-categories`

Current API:

- `POST /task-categories`
- `GET /task-categories`
- `GET /task-categories/:id`
- `PATCH /task-categories/:id`
- `DELETE /task-categories/:id`

Entity fields:

- `id`
- `name`
- `description`
- `createdAt`
- `updatedAt`

Assessment:

- OK: Basic CRUD exists.
- Risk: Categories are global today; the target domain says `Family 1-* TaskCategories`.
- Risk: `name` is globally unique today; after adding families, uniqueness should
  probably become `(familyId, name)`.

### `tasks`

Current API:

- `POST /tasks`
- `GET /tasks`
- `GET /tasks/:id`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`

Entity fields:

- `id`
- `categoryId`
- `title`
- `description`
- `recurrenceType`
- `dayOfWeek`
- `isActive`
- `createdAt`
- `updatedAt`

Assessment:

- OK: Basic CRUD exists.
- OK: Relation with `TaskCategory` exists.
- Risk: Tasks are global today; the target domain says `Family 1-* Tasks`.
- Risk: The current recurrence model only supports weekly recurrence.

### `task-rotations`

Current API:

- `PUT /tasks/:taskId/rotation`
- `GET /tasks/:taskId/rotation`
- `DELETE /tasks/:taskId/rotation/:familyMemberId`

Entity fields:

- `id`
- `taskId`
- `familyMemberId`
- `position`
- `isActive`
- `createdAt`
- `updatedAt`

Assessment:

- OK: Uses `FamilyMember` instead of local users.
- OK: Validates that referenced members are active.
- Risk: Does not yet verify that the task and family member belong to the same family
  because `tasks.familyId` does not exist yet.

## Existing entities without complete module API

### `TaskAssignment`

Current fields:

- `id`
- `taskId`
- `assignedFamilyMemberId`
- `scheduledFor`
- `status`
- `completedAt`
- `notes`
- `createdAt`
- `updatedAt`

Assessment:

- Risk: The entity exists, but there is no `task-assignments` module/controller/service.
- Risk: Target plan expects `familyMemberId`, `startDate`, and `endDate`, not
  `assignedFamilyMemberId` and `scheduledFor`.
- Risk: Current statuses include `expired`; target plan lists only `pending`,
  `completed`, and `skipped`.

### `TaskAssignmentLog`

Current fields:

- `id`
- `assignmentId`
- `changedByFamilyMemberId`
- `fromStatus`
- `toStatus`
- `message`
- `createdAt`

Assessment:

- Risk: This is closer to an audit log than the requested `TaskHistory` model.
- Risk: Target plan expects `TaskHistory` with `completedBy`, `completedAt`, and
  `notes`.

## Migration state

Current migration:

- `src/database/migrations/1781802374016-InitialSchema.ts`

Tables created:

- `task_categories`
- `family_members`
- `task_rotation_members`
- `tasks`
- `task_assignments`
- `task_assignment_logs`

Assessment:

- OK: No `users`, `sessions`, `refresh_tokens`, `applications`, password reset, or
  email verification tables remain.
- Risk: No `families` table yet.
- Risk: No `task_history`, `notifications`, `settings`, or report-specific tables yet.

## Relationship review

Current relationships:

```txt
TaskCategory 1 --- * Task
Task 1 --- * TaskRotationMember
FamilyMember 1 --- * TaskRotationMember
Task 1 --- * TaskAssignment
FamilyMember 1 --- * TaskAssignment
TaskAssignment 1 --- * TaskAssignmentLog
FamilyMember 1 --- * TaskAssignmentLog
```

Target relationships still missing:

```txt
Family 1 --- * FamilyMember
Family 1 --- * Task
Family 1 --- * TaskCategory
```

## Recommended implementation order

### Etapa 1

1. Add `families` module, entity, DTOs, service, controller, and migration changes.
2. Convert `FamilyMember.familyId` into a real `ManyToOne` relation.
3. Add `familyId` relations to `TaskCategory` and `Task`.
4. Add same-family validation between tasks, categories, rotations, and members.

### Etapa 2

1. Replace the current assignment shape with the target assignment model:
   `taskId`, `familyMemberId`, `startDate`, `endDate`, `status`, `completedAt`.
2. Add `task-assignments` module with generation and completion flows.
3. Add `task-history` module for completion history.

### Etapa 3

1. Add `/my-tasks` using a temporary identity context abstraction.
2. Add `/dashboard` based on assignments and history.

### Etapa 4

1. Add reports endpoints.
2. Add notifications without push delivery.
3. Add settings with an explicit scope decision.

## Open decisions before implementation

| Decision | Why it matters | Suggested default |
|----------|----------------|-------------------|
| Family status values | Affects filtering and deletion behavior | `active`, `inactive` |
| `createdBy` source | Comes from Identity API user id, but JWT guard is future work | Store as `created_by_identity_user_id` string |
| Settings scope | Avoids rewriting settings later | Start with family-level settings |
| Task assignment date model | Current model uses one date; target uses range | Adopt `startDate` + `endDate` |
| Task history vs log | Avoid duplicate concepts | Keep `TaskHistory` for business history; use logs only if audit is needed |

## Verification commands

Run after each implementation stage:

```bash
npm run build
npm run migration:run
```

If the local DB already ran old migrations, recreate the development database
before validating the new initial schema.
