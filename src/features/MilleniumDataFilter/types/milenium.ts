/**
 * Core TypeScript types for Milenium Data Filter & Converter
 * All types related to data validation, parsing, and processing
 */

/**
 * Raw data row from parsed spreadsheet (CSV, ODS, XLSX)
 * Keys are column names, values are cell contents
 */
export interface RowData {
  [key: string]: unknown;
}

/**
 * Required columns for Millenium export files (Status de NFe)
 * Maps to actual Millenium export column names
 */
export const REQUIRED_MILLENIUM_COLUMNS = {
  cnpjCpf: 'Cnpj/Cpf Destinatário', // Customer CPF/CNPJ
  customerName: 'Nome Destinatário', // Customer name (filial)
  cfop: 'Cfop', // CFOP code (fiscal operation)
  value: 'Valor', // Total invoice value
} as const;

export type RequiredMilleniumColumnKey = keyof typeof REQUIRED_MILLENIUM_COLUMNS;

/**
 * Schema validation check result
 * Contains detailed information about validation pass/fail
 */
export interface SchemaCheckResult {
  isValid: boolean;
  missingColumns: string[];
  emptyRowIndices: number[];
  invalidDocumentIndices: number[];
  corruptRowIndices: number[];
}

/**
 * Validation result with error messages and summary
 */
export interface ValidationResult {
  isValid: boolean;
  totalRows: number;
  validRows: number;
  errorCount: number;
  missingColumns: string[];
  errors: string[];
  warnings: string[];
}

/**
 * Health check status for UI rendering
 */
export interface HealthCheckStatus {
  status: 'idle' | 'checking' | 'valid' | 'invalid';
  result: ValidationResult | null;
  isLoading: boolean;
}

/**
 * CPF/CNPJ validation result
 */
export interface DocumentValidationResult {
  isValid: boolean;
  documentType: 'cpf' | 'cnpj' | 'unknown';
  value: string;
}
