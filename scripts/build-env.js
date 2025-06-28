#!/usr/bin/env node

/**
 * Build environment setup script
 * Loads environment variables for the pre-rendering process
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file if it exists
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  envVars.forEach(line => {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').replace(/^['"]|['"]$/g, '');
    if (key && value !== undefined) {
      process.env[key] = value;
    }
  });
}

console.log('Environment variables loaded for pre-rendering');