import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDto } from '../src/user/dto/edit-user.dto';
import { TEST_ID } from './setup';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  // Test user data
  const testUser = {
    email: `user-test-${TEST_ID}@example.com`,
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
  };

  // Tokens for authentication
  let accessToken: string;

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

    // create test user and get token
    const signupResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(testUser);

    accessToken = signupResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  // profile test
  describe('GET /user/profile', () => {
    it('should get profile with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/user/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // check user information
      expect(response.body.email).toBe(testUser.email);
      expect(response.body.firstName).toBe(testUser.firstName);
      expect(response.body.lastName).toBe(testUser.lastName);

      // password hash should not be returned
      expect(response.body).not.toHaveProperty('hash');
    });

    it('should return error when getting profile without token', async () => {
      await request(app.getHttpServer()).get('/user/profile').expect(401);
    });

    it('should return error when getting profile with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/user/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  // user update test
  describe('PATCH /user/update', () => {
    const updateData: EditUserDto = {
      firstName: 'Updated',
      lastName: 'User',
    };

    it('should update user information with valid token', async () => {
      const response = await request(app.getHttpServer())
        .patch('/user/update')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      // check updated user information
      expect(response.body.firstName).toBe(updateData.firstName);
      expect(response.body.lastName).toBe(updateData.lastName);
      expect(response.body.email).toBe(testUser.email);

      // password hash should not be returned
      expect(response.body).not.toHaveProperty('hash');
    });

    it('should return error when updating user information with invalid data', async () => {
      const invalidData = {
        firstName: 123, // should be a string but sending a number
        email: 'not-an-email', // invalid email format
      };

      await request(app.getHttpServer())
        .patch('/user/update')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidData)
        .expect(400);
    });

    it('should return error when updating user information without token', async () => {
      await request(app.getHttpServer())
        .patch('/user/update')
        .send(updateData)
        .expect(401);
    });

    it('should return error when updating user information with invalid token', async () => {
      await request(app.getHttpServer())
        .patch('/user/update')
        .set('Authorization', 'Bearer invalid-token')
        .send(updateData)
        .expect(401);
    });
  });
});
