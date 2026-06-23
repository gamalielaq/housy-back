# Turnly auth cleanup audit

## Decision

Turnly does not own authentication or identity. Identity API owns register, login,
refresh token, logout, sessions, applications, and user identity.

Turnly keeps only business-domain membership data through `family_members`.

## Removed auth/identity ownership

- Removed local `users` module because it represented identity through `name`,
  `email`, and active state.
- Removed JWT environment variables from local `.env` because this API does not
  issue tokens.
- Removed the `users` table from the initial migration.

## Kept business-domain ownership

- `task-categories`
- `tasks`
- `task-rotations`
- `task-assignments`
- `common`
- `config`
- `database`

## Replacement model

`family_members` stores Turnly membership data:

- `id`
- `identity_user_id`
- `family_id`
- `display_name`
- `role`
- `status`
- `created_at`
- `updated_at`

`identity_user_id` is a reference to the user from Identity API. It is not a
local auth user.
