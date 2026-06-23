# Dashboard

The dashboard endpoint summarizes assignment progress for frontend cards.

## API

```txt
GET /dashboard
```

## Response shape

```json
{
    "pendingTasks": 0,
    "completedTasks": 0,
    "nextTasks": [],
    "topMember": null,
    "completionPercentage": 0
}
```

## Source data

Dashboard values are calculated from `task_assignments`.
