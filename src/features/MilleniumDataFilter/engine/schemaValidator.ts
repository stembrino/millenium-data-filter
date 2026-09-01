/**
 * Pure TypeScript schema validator for Milenium export data
 * NO React code - fully testable and isolated
 */

import type {
  RowData,
  ValidationResult,
  SchemaCheckResult,
  DocumentValidationResult,
} from '../types/milenium';

/**
 * Validates a CPF/CNPJ document string format (not strict checksum validation)
 * Accepts real Millenium export data that already passed Millenium's validation
 * CPF: 11 digits, CNPJ: 14 digits (with or without formatting)
 * Also accepts slightly malformed data (10-16 digits) from legacy/edge cases
 *
 * @param value The document string to validate
 * @returns DocumentValidationResult with validation status and type
 */
export function validateCPFCNPJ(value: string): DocumentValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, documentType: 'unknown', value };
  }

  const trimmed = value.trim();

  // Remove common formatting characters
  const cleaned = trimmed.replace(/[.\-\s\/]/g, '');

  // Must be digits only after cleaning
  if (!/^\d+$/.test(cleaned)) {
    return { isValid: false, documentType: 'unknown', value };
  }

  // Flexible digit length validation
  // CPF = 11, CNPJ = 14, but accept 10-16 for edge cases/malformed data
  const length = cleaned.length;
  
  if (length >= 10 && length <= 16) {
    // Classify as CPF (shorter) or CNPJ (longer)
    const documentType = length <= 12 ? 'cpf' : 'cnpj';
    return {
      isValid: true, // Accept flexible lengths (Millenium already validated)
      documentType,
      value,
    };
  }

  return { isValid: false, documentType: 'unknown', value };
}

/**
 * Detects empty rows (rows with all null/undefined/empty values)
 *
 * @param data Array of row objects
 * @returns Array of indices for completely empty rows
 */
export function detectEmptyRows(data: RowData[]): number[] {
  const emptyIndices: number[] = [];

  data.forEach((row, index) => {
    const isEmpty = Object.values(row).every((value) => {
      if (value === null || value === undefined) return true;
      if (typeof value === 'string' && value.trim() === '') return true;
      return false;
    });

    if (isEmpty) {
      emptyIndices.push(index);
    }
  });

  return emptyIndices;
}

/**
 * Detects rows with invalid CPF/CNPJ documents
 *
 * @param data Array of row objects
 * @returns Array of indices for rows with invalid documents
 */
export function detectInvalidDocuments(data: RowData[]): number[] {
  const invalidIndices: number[] = [];

  data.forEach((row, index) => {
    // Check real Millenium column: "Cnpj/Cpf Destinatário"
    const docValue = row['Cnpj/Cpf Destinatário'];

    if (docValue) {
      const validation = validateCPFCNPJ(String(docValue));
      if (!validation.isValid) {
        invalidIndices.push(index);
      }
    }
  });

  return invalidIndices;
}

/**
 * Detects rows with inconsistent structure
 * Only checks for REQUIRED business columns, not optional ones
 * Sparse rows (missing optional trailing columns) are acceptable
 *
 * @param data Array of row objects
 * @returns Array of indices for rows missing required columns
 */
export function detectCorruptRows(data: RowData[]): number[] {
  if (data.length === 0) return [];

  const corruptIndices: number[] = [];

  // Only check for REQUIRED Millenium columns
  // These are the business-critical fields
  const requiredColumns = [
    'Data',
    'Nota/Faixa',
    'Série',
    'Valor',
    'Nome Destinatário',
    'Cnpj/Cpf Destinatário',
  ];

  data.forEach((row, index) => {
    if (index === 0) return; // Skip first row

    // Check if row is missing any REQUIRED columns
    for (const col of requiredColumns) {
      if (!(col in row)) {
        corruptIndices.push(index);
        break; // Only add index once
      }
    }
  });

  return corruptIndices;
}

/**
 * Validates entire Millenium schema
 * Runs all checks: required columns, empty rows, invalid documents, corrupt rows
 *
 * @param data Array of parsed rows from file
 * @returns SchemaCheckResult with detailed validation info
 */
export function performSchemaCheck(data: RowData[]): SchemaCheckResult {
  const missingColumns: string[] = [];
  const emptyRowIndices = detectEmptyRows(data);
  const invalidDocumentIndices = detectInvalidDocuments(data);
  const corruptRowIndices = detectCorruptRows(data);

  // Check for required columns from real Millenium export
  if (data.length > 0) {
    const firstRow = data[0];
    const availableKeys = new Set(Object.keys(firstRow));

    // Check for CPF/CNPJ column
    if (!availableKeys.has('Cnpj/Cpf Destinatário')) {
      missingColumns.push('Cnpj/Cpf Destinatário');
    }

    // Check for CFOP column (Important!)
    if (!availableKeys.has('Cfop')) {
      missingColumns.push('Cfop');
    }

    // Check for customer name / filial column
    if (!availableKeys.has('Nome Destinatário')) {
      missingColumns.push('Nome Destinatário');
    }

    // Check for value column
    if (!availableKeys.has('Valor')) {
      missingColumns.push('Valor');
    }
  }

  const isValid =
    missingColumns.length === 0 &&
    emptyRowIndices.length === 0 &&
    invalidDocumentIndices.length === 0 &&
    corruptRowIndices.length === 0;

  return {
    isValid,
    missingColumns,
    emptyRowIndices,
    invalidDocumentIndices,
    corruptRowIndices,
  };
}

/**
 * Main validation function - orchestrates all checks and formats result for UI
 *
 * @param data Array of parsed rows from file
 * @returns ValidationResult with formatted messages for display
 */
export function validateMileniumSchema(data: RowData[]): ValidationResult {
  const schemaCheck = performSchemaCheck(data);
  const errors: string[] = [];
  const warnings: string[] = [];

  // Build error messages
  if (schemaCheck.missingColumns.length > 0) {
    errors.push(
      `Missing required columns: ${schemaCheck.missingColumns.join(', ')}`
    );
  }

  if (schemaCheck.emptyRowIndices.length > 0) {
    errors.push(
      `Found ${schemaCheck.emptyRowIndices.length} empty row(s) at indices: ${schemaCheck.emptyRowIndices.slice(0, 5).join(', ')}${schemaCheck.emptyRowIndices.length > 5 ? '...' : ''}`
    );
  }

  if (schemaCheck.invalidDocumentIndices.length > 0) {
    warnings.push(
      `Found ${schemaCheck.invalidDocumentIndices.length} row(s) with invalid CPF/CNPJ at indices: ${schemaCheck.invalidDocumentIndices.slice(0, 5).join(', ')}${schemaCheck.invalidDocumentIndices.length > 5 ? '...' : ''}`
    );
  }

  if (schemaCheck.corruptRowIndices.length > 0) {
    warnings.push(
      `Found ${schemaCheck.corruptRowIndices.length} potentially corrupt row(s) at indices: ${schemaCheck.corruptRowIndices.slice(0, 5).join(', ')}${schemaCheck.corruptRowIndices.length > 5 ? '...' : ''}`
    );
  }

  const validRows =
    data.length -
    schemaCheck.emptyRowIndices.length -
    schemaCheck.invalidDocumentIndices.length -
    schemaCheck.corruptRowIndices.length;

  return {
    isValid: schemaCheck.isValid,
    totalRows: data.length,
    validRows: Math.max(0, validRows),
    errorCount: errors.length,
    missingColumns: schemaCheck.missingColumns,
    errors,
    warnings,
  };
}
