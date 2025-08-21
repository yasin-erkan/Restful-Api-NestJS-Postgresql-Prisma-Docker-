import * as dotenv from 'dotenv';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

// load environment variables
// if file does not exist, use current environment variables
dotenv.config({
  path: join(process.cwd(), '.env.test'),
});

// increase timeout for tests
jest.setTimeout(30000);

// create a unique id for tests
// this id is used to avoid conflicts between test files
export const TEST_ID = uuidv4().substring(0, 8);
