# Notifications

Notifications are stored in Turnly, but push delivery is intentionally out of
scope for now.

## Entity

`Notification` stores:

- `id`
- `title`
- `message`
- `read`
- `createdAt`

## API

- `POST /notifications`
- `GET /notifications`
- `PATCH /notifications/:id/read`

## Current scope

The module only stores and marks notifications as read. Push notifications can
be added later without changing the base read model.
