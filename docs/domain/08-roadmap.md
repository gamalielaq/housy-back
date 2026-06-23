# Roadmap

Turnly backend is now ready to support the first frontend integration pass.

## Implemented backend foundation

- Families
- FamilyMembers
- TaskCategories
- Tasks
- TaskRotations
- TaskAssignments
- TaskHistory
- MyTasks
- Dashboard
- Reports
- Notifications
- Settings

## Still future work

- `common/guards/identity-jwt.guard.ts`
- Real JWT validation against Identity API keys/configuration
- Family-aware authorization checks per endpoint
- Push notification delivery
- More recurrence types beyond weekly
- Pagination and filtering for list endpoints

## Frontend integration note

Angular should consume these APIs directly. It should not implement domain rules
that belong in the backend, such as assignment generation or report aggregation.
