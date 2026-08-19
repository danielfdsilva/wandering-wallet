import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

export const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

dotenv.config({ path: join(repoRoot, '.env') });
