/**
 * Environment loader with fallback.
 *
 * Precedence: OS environment > backend/.env > backend/.env.example
 *
 * - dotenv never overrides variables that already exist, so real secrets
 *   in .env (or the OS environment) always win.
 * - Any variable defined in .env.example but MISSING from .env is filled in
 *   automatically and a warning lists exactly which keys were borrowed.
 *   This keeps fresh clones runnable without crashing on undefined values.
 *
 * Usage (side-effect import, must run before anything reads process.env):
 *   require('./config/env');
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const backendRoot = path.resolve(__dirname, '..');

// 1) Real environment file
dotenv.config({ path: path.join(backendRoot, '.env'), quiet: true });

// 2) Fallback: fill only the keys that are still missing
const examplePath = path.join(backendRoot, '.env.example');
if (fs.existsSync(examplePath)) {
  const exampleVars = dotenv.parse(fs.readFileSync(examplePath, 'utf8'));
  const missing = Object.keys(exampleVars).filter((key) => process.env[key] === undefined);

  if (missing.length > 0) {
    dotenv.config({ path: examplePath, quiet: true }); // override: false by default
    console.warn(
      `[env] Not set in .env — using .env.example defaults for: ${missing.join(', ')}`
    );
  }
}
