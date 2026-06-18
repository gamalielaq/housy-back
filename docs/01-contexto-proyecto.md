# Contexto del proyecto

Esta documentación define el MVP backend para una aplicación familiar de turnos y tareas del hogar. El objetivo es construir una API REST en NestJS, con MySQL y TypeORM, preparada para que más adelante se conecte un frontend Angular/Ionic.

## Objetivo

Permitir que una familia administre tareas recurrentes del hogar, las asigne rotativamente entre sus miembros y registre si fueron realizadas o no.

Ejemplos de tareas:

- Limpiar cocina
- Limpiar baño
- Sacar basura
- Ordenar living
- Lavar platos

## Alcance del MVP

El MVP se enfocará en backend y base de datos:

- Gestión de miembros de la familia.
- Gestión de categorías de tareas.
- Gestión de tareas recurrentes.
- Configuración de rotaciones por tarea.
- Generación de asignaciones futuras.
- Consulta de asignaciones por semana.
- Cambio de estado de asignaciones.
- Historial básico de cambios por asignación.

## Fuera de alcance por ahora

No se implementará todavía:

- Frontend web o móvil.
- Autenticación y autorización.
- Roles avanzados.
- Notificaciones push/email.
- Multi-familia o multi-tenant.
- Penalizaciones, puntos o gamificación.
- Calendario visual.
- Integración con Google Calendar.
- Automatizaciones externas.

## Flujo principal de uso

1. Se crean los usuarios que representan miembros de la familia.
2. Se crean categorías para agrupar tareas.
3. Se crean tareas del hogar con reglas básicas de recurrencia.
4. Se configura qué usuarios participan en la rotación de cada tarea.
5. La API genera asignaciones para una semana o rango de fechas.
6. Los usuarios consultan las tareas asignadas.
7. Una asignación se marca como completada, omitida, vencida o no realizada.
8. Cada cambio relevante queda registrado en el historial.

## Criterios guía

- Backend primero.
- Sin autenticación inicial.
- Arquitectura simple, limpia y extensible.
- Entidades TypeORM claras.
- DTOs separados para creación y actualización.
- Validación con `class-validator` y transformación con `class-transformer`.
- Migraciones obligatorias para cambios de base de datos.
- `synchronize: true` no debe usarse en producción.
