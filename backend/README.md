
# API Sentinel

Rule-Based API Intrusion Detection and Security Monitoring System.

## Technology Stack

- Java 21
- Spring Boot
- Spring Security and JWT
- Spring Data JPA / Hibernate
- PostgreSQL
- Maven

## Current Status

Backend project structure is being prepared.
Implementation of authentication, event logging, detection,
risk scoring, incident management and dashboard APIs is in progress.

## Local Prerequisites

- JDK 21
- Maven
- PostgreSQL

## Configuration

Configure the following environment variables before running the backend:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION_MS` (optional)

Never commit production credentials or JWT secrets.

## Team Development

Coordinate changes to shared configuration, entities, DTOs
and service interfaces before merging work into `staging`.
