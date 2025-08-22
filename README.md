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

## 🌟 Features

### 👤 Authentication & Authorization
- Secure user registration and login system
- JWT-based authentication with access and refresh tokens
- Role-based access control
- Password hashing and security best practices

### 📑 Bookmark Management
- CRUD operations for bookmarks
- Rich metadata support
- User-specific bookmark collections
- Search and filtering capabilities

### 🛡 Security
- Input validation and sanitization
- Rate limiting
- CORS protection
- Environment-based configuration

### 🔄 Data Persistence
- PostgreSQL database integration
- Prisma ORM for type-safe database operations
- Database migrations
- Data validation and integrity

## 🛠 Tech Stack

### Core Technologies
- **Backend Framework:** NestJS (Node.js)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (Access + Refresh Tokens)
- **Container:** Docker & Docker Compose

### Development Tools
- **Testing:** Jest + e2e Tests
- **API Documentation:** Postman Collection
- **Code Quality:** ESLint + Prettier
- **Type Safety:** TypeScript
- **API Testing:** Postman Collections

## 🏗 Architecture

### System Architecture

\`\`\`mermaid
graph LR
    Client[Client] --> API[NestJS API]
    API --> Auth[Auth Module]
    API --> User[User Module]
    API --> Bookmark[Bookmark Module]
    Auth --> DB[(PostgreSQL)]
    User --> DB
    Bookmark --> DB
    Auth --> Cache[Cache]
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
    }
    Bookmark {
        int id PK
        string title
        string description
        string link
        int userId FK
        datetime createdAt
        datetime updatedAt
    }
\`\`\`

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- Docker (optional)
- npm/yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repo-url>
   cd Bookmark
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   \`\`\`bash
   # Create .env file with the following variables
   DATABASE_URL="postgresql://user:password@localhost:5432/bookmark?schema=public"
   JWT_SECRET="your-jwt-secret"
   JWT_REFRESH_SECRET="your-refresh-secret"
   \`\`\`

4. **Database Setup**
   \`\`\`bash
   # Run migrations
   npx prisma migrate dev
   
   # Generate Prisma Client
   npx prisma generate
   \`\`\`

### Running the Application

#### Development Mode
\`\`\`bash
npm run start:dev
\`\`\`

#### Production Mode
\`\`\`bash
npm run build
npm run start:prod
\`\`\`

### Docker Setup

\`\`\`bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

## 📡 API Reference

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /auth/signup | Register new user | No |
| POST | /auth/signin | User login | No |
| POST | /auth/refresh | Refresh token | Yes |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /users/me | Get user profile | Yes |
| PATCH | /users | Update profile | Yes |

### Bookmark Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /bookmarks | List bookmarks | Yes |
| POST | /bookmarks | Create bookmark | Yes |
| GET | /bookmarks/:id | Get bookmark | Yes |
| PATCH | /bookmarks/:id | Update bookmark | Yes |
| DELETE | /bookmarks/:id | Delete bookmark | Yes |

## 🧪 Testing

### Running Tests

\`\`\`bash
# Run all tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov
\`\`\`

### Test Coverage Goals
- Unit Tests: >80%
- E2E Tests: >70%
- Integration Tests: >75%

## 📚 Documentation

### API Documentation
- Postman Collection: \`bookmark-app.postman_collection.json\`
- Environment: \`bookmark-environment.postman_environment.json\`
- Scripted Tests: \`bookmark-app-with-scripts.postman_collection.json\`

For detailed API usage, refer to \`postman-guide.md\`.

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on auth endpoints
- Input validation
- CORS protection
- Environment variable security

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [JWT.io](https://jwt.io/)
- [Docker Documentation](https://docs.docker.com/)