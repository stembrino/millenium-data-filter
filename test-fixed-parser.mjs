import fs from 'fs';
import { parseFileToJSON } from './dist/src/engine/fileParser.js';
import { validateMileniumSchema } from './dist/src/engine/schemaValidator.js';

// Read file
const fileBuffer = fs.readFileSync('/Users/rdn346/Downloads/Status de NFe.xlsx');
const parsed = parseFileToJSON(fileBuffer.buffer, 'Status de NFe.xlsx');

if (parsed.success && parsed.data) {
  console.log('=== PARSE RESULT ===');
  console.log('Rows:', parsed.rowCount);
  
  console.log('\n=== ACTUAL COLUMN NAMES AFTER PARSE ===');
  const cols = Object.keys(parsed.data[0]);
  cols.slice(0, 10).forEach((col, i) => {
    console.log(`${i}: "${col}"`);
  });
  
  console.log('\n=== VALIDATION RESULT ===');
  const validation = validateMileniumSchema(parsed.data);
  console.log('Valid:', validation.isValid);
  console.log('Total rows:', validation.totalRows);
  console.log('Valid rows:', validation.validRows);
  console.log('Missing columns:', validation.missingColumns);
  console.log('Errors:', validation.errors);
  console.log('Warnings:', validation.warnings);
} else {
  console.log('Parse failed:', parsed.error);
}
