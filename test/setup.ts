import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
  try {
    console.log('------- Global before each-------');
    await rm(join(__dirname, '..', 'db-test.sqlite'));
  } catch (err) {}
});
