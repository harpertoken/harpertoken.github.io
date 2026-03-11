#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

const filePath = process.argv[2] || path.join(__dirname, '..', 'index.html');

if (!fs.existsSync(filePath)) {
  console.error(`${RED}File not found: ${filePath}${RESET}`);
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');
let errors = 0;

console.log(`Linting ${filePath}...\n`);

// Check for DOCTYPE
if (!content.includes('<!DOCTYPE html>')) {
  console.log(`${RED}Missing or incorrect DOCTYPE${RESET}`);
  errors++;
} else {
  console.log(`${GREEN}DOCTYPE present${RESET}`);
}

// Check for unescaped & in attributes
const unescapedAmp = content.match(/<[^>]*\b(src|href)="[^"]*[^&]&[^a][^m][^p][^;][^"]*"/g);
if (unescapedAmp) {
  console.log(`${RED}Unescaped & in attributes:${RESET}`);
  unescapedAmp.forEach(match => console.log(`   ${match}`));
  errors++;
} else {
  console.log(`${GREEN}No unescaped & in attributes${RESET}`);
}

// Check for <html lang>
if (!content.match(/<html[^>]*lang="/)) {
  console.log(`${RED}Missing lang attribute on <html>${RESET}`);
  errors++;
} else {
  console.log(`${GREEN}<html> has lang attribute${RESET}`);
}

// Check for <title>
if (!content.match(/<title>/)) {
  console.log(`${RED}Missing <title>${RESET}`);
  errors++;
} else {
  console.log(`${GREEN}<title> present${RESET}`);
}

// Check for <meta charset>
if (!content.match(/<meta[^>]*charset="/)) {
  console.log(`${RED}Missing <meta charset>${RESET}`);
  errors++;
} else {
  console.log(`${GREEN}<meta charset> present${RESET}`);
}

if (errors === 0) {
  console.log(`\n${GREEN}All checks passed!${RESET}`);
} else {
  console.log(`\n${RED}${errors} error(s) found.${RESET}`);
  process.exit(1);
}