# 🔖 Bookmark API

A modern RESTful API for bookmark management system.

## 🚀 Features

- 👤 User Management

  - Registration and Login
  - JWT Authentication
  - Refresh Token support
  - Profile updates

- 📑 Bookmark Operations
  - Create bookmarks
  - Edit and delete
  - List and view details
  - User-specific bookmark management

## 🛠 Tech Stack

- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (Access + Refresh Tokens)
- **Testing:** Jest + e2e Tests
- **API Documentation:** Postman Collection
- **Container:** Docker

## 📋 Prerequisites

- Node.js (v18+)
- PostgreSQL
- Docker (optional)

## 🚀 Installation

1. Clone the repository

```bash
git clone <repo-url>
cd Bookmark
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
# Create .env file
DATABASE_URL="postgresql://user:password@localhost:5432/bookmark?schema=public"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
```

4. Run database migrations

```bash
npx prisma migrate dev
```

5. Start the application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 🐳 Docker Setup

```bash
# Start services
docker-compose up -d
```

## 🔍 API Endpoints

### Auth

- `POST /auth/signup` - Register new user
- `POST /auth/signin` - User login
- `POST /auth/refresh` - Refresh token

### Users

- `GET /users/me` - Get user profile
- `PATCH /users` - Update profile

### Bookmarks

- `GET /bookmarks` - List bookmarks
- `POST /bookmarks` - Create new bookmark
- `GET /bookmarks/:id` - Get bookmark details
- `PATCH /bookmarks/:id` - Update bookmark
- `DELETE /bookmarks/:id` - Delete bookmark

## 🧪 Testing

```bash
# Run e2e tests
npm run test:e2e

# Run unit tests
npm run test
```

## 📚 API Documentation

Postman collections are included in the project:

- `bookmark-app.postman_collection.json`
- `bookmark-app-with-scripts.postman_collection.json`
- `bookmark-environment.postman_environment.json`

For detailed usage, please refer to `postman-guide.md`.

## 📝 Schema

### User Model

```prisma
model User {
  id        Int        @id @default(autoincrement())
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  email     String     @unique
  hash      String
  firstName String?
  lastName  String?
  bookmarks Bookmark[]
}
```

### Bookmark Model

```prisma
model Bookmark {
  id          Int      @id @default(autoincrement())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  title       String
  description String?
  link        String
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
}
```

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License
