import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { SignupDto } from '../src/auth/dto/auth.dto';
import { TEST_ID } from './setup';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  // Test user data
  const testUser = {
    email: `auth-test-${TEST_ID}@example.com`,
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
  };

  // Tokens for authentication
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    // Create test app
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Validation pipeline setup to match app's pipeline
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();

    // Get prisma service
    prisma = app.get(PrismaService);

    // clean database and reset
    await prisma.cleanDb();
  });

  afterAll(async () => {
    await app.close();
  });

  // signup test
  describe('POST /auth/signup', () => {
    it('should signup with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');

      // save tokens for later use
      accessToken = response.body.access_token;
      refreshToken = response.body.refresh_token;
    });

    it('should return error when signing up with repeated email', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(testUser)
        .expect(403);
    });

    it('should return error when signing up with missing fields', async () => {
      const invalidUser = {
        email: 'not-an-email',
        password: '',
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(invalidUser)
        .expect(400);
    });
  });

  // login test
  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');

      // update current tokens
      accessToken = response.body.access_token;
      refreshToken = response.body.refresh_token;
    });

    it('should return error when logging in with invalid email', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'wrong@example.com',
          password: testUser.password,
        })
        .expect(403);
    });

    it('should return error when logging in with invalid password', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrong password',
        })
        .expect(403);
    });
  });

  // logout test
  describe('POST /auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Logged out successfully');
    });
  });

  // token refresh test
  describe('POST /auth/refresh', () => {
    it('should refresh token with valid refresh token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('access_token');

      // update access token
      accessToken = response.body.access_token;
    });

    it('should return error when refreshing token with invalid refresh token', async () => {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should return error when refreshing token without refresh token', async () => {
      await request(app.getHttpServer()).post('/auth/refresh').expect(401);
    });
  });
});
