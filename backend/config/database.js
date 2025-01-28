import dbLocal from "db-local";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = path.join(__dirname, '../../databases');

export const { Schema } = new dbLocal({ path: dbPath }); 