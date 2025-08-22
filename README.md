# 🔖 Bookmark API

<div align="center">

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)

A modern, secure, and scalable RESTful API for bookmark management built with NestJS, PostgreSQL, and Prisma.

[Features](#-features) •
[Tech Stack](#-tech-stack) •
[Getting Started](#-getting-started) •
[API Reference](#-api-reference) •
[Architecture](#-architecture) •
[Testing](#-testing)

</div>

## 🏗 Architecture

### System Overview

\`\`\`mermaid
graph TB
    Client[Client Applications]
    API[NestJS API Layer]
    Auth[Auth Module]
    User[User Module]
    Book[Bookmark Module]
    Guard[JWT Guard]
    Cache[Redis Cache]
    DB[(PostgreSQL)]
    Prisma[Prisma ORM]
    
    Client -->|HTTP/HTTPS| API
    API -->|Validates| Guard
    Guard -->|Authenticates| Auth
    
    subgraph NestJS Modules
        Auth --> User
        Auth --> Book
        User --> Book
    end
    
    subgraph Data Layer
        Auth -->|Query| Prisma
        User -->|Query| Prisma
        Book -->|Query| Prisma
        Prisma -->|Persist| DB
        Auth -->|Cache| Cache
    end

    style Client fill:#f9f,stroke:#333,stroke-width:2px
    style API fill:#bbf,stroke:#333,stroke-width:2px
    style DB fill:#bfb,stroke:#333,stroke-width:2px
\`\`\`

### Authentication Flow

\`\`\`mermaid
sequenceDiagram
    participant C as Client
    participant A as Auth Controller
    participant S as Auth Service
    participant D as Database
    
    C->>A: POST /auth/signup
    A->>S: Create User
    S->>D: Save User
    D-->>S: User Created
    S-->>A: Generate Tokens
    A-->>C: Return Tokens
    
    C->>A: POST /auth/signin
    A->>S: Validate Credentials
    S->>D: Find User
    D-->>S: User Data
    S-->>A: Generate Tokens
    A-->>C: Return Tokens
    
    C->>A: POST /auth/refresh
    A->>S: Validate Refresh Token
    S->>D: Verify Token
    D-->>S: Token Valid
    S-->>A: Generate New Tokens
    A-->>C: Return New Tokens
\`\`\`

### Bookmark Operation Flow

\`\`\`mermaid
graph TD
    A[Client Request] -->|JWT Token| B{Auth Guard}
    B -->|Invalid| C[401 Unauthorized]
    B -->|Valid| D[Bookmark Controller]
    D -->|Create| E[Bookmark Service]
    D -->|Read| E
    D -->|Update| E
    D -->|Delete| E
    E -->|Prisma| F[(Database)]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#fbb,stroke:#333,stroke-width:2px
    style D fill:#bfb,stroke:#333,stroke-width:2px
    style E fill:#fbf,stroke:#333,stroke-width:2px
    style F fill:#bff,stroke:#333,stroke-width:2px
\`\`\`

### Database Schema

\`\`\`mermaid
erDiagram
    User ||--o{ Bookmark : has
    User {
        int id PK
        string email
        string hash
        string firstName
        string lastName
        datetime createdAt
        datetime updatedAt
        string refreshToken
    }
    Bookmark {
        int id PK
        string title
        string description
        string link
        int userId FK
        datetime createdAt
        datetime updatedAt
        boolean isPublic
        string tags
    }
```

