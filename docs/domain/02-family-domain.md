# Family domain

Families are the root aggregate for Turnly business data.

## Entity

`Family` stores:

- `id`
- `name`
- `description`
- `status`
- `createdBy`
- `createdAt`
- `updatedAt`

## API

- `POST /families`
- `GET /families`
- `GET /families/:id`
- `PATCH /families/:id`
- `DELETE /families/:id`

`DELETE` performs logical deactivation by setting `status = inactive`.

## Relationships

```txt
Family 1 --- * FamilyMember
Family 1 --- * TaskCategory
Family 1 --- * Task
Family 1 --- 1 Settings
```

## Identity boundary

`createdBy` stores an Identity API user id. Turnly does not validate passwords,
issue tokens, or own the identity lifecycle.
