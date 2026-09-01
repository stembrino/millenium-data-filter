/**
 * File Parser - Converts uploaded files to JSON
 * Supports: .xlsx, .csv, .ods using SheetJS
 */

import * as XLSX from 'xlsx';
import type { RowData } from '../types/milenium';

export interface ParseResult {
  success: boolean;
  data?: RowData[];
  error?: string;
  fileName?: string;
  rowCount?: number;
}

/**
 * Parse file buffer and convert to RowData array
 * Supports: .xlsx, .csv, .ods
 */
export function parseFileToJSON(
  buffer: ArrayBuffer,
  fileName: string
): ParseResult {
  try {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheet = workbook.SheetNames[0];

    if (!firstSheet) {
      return {
        success: false,
        error: 'No sheets found in file',
      };
    }

    const worksheet = workbook.Sheets[firstSheet];
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    if (!Array.isArray(rawData) || rawData.length === 0) {
      return {
        success: false,
        error: 'File is empty or contains no valid data',
      };
    }

    const convertedData = rawData.map((row: any) =>
      normalizeRowData(row)
    );

    return {
      success: true,
      data: convertedData,
      fileName,
      rowCount: convertedData.length,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Normalize row data - convert string numbers to actual numbers
 * and standardize null/undefined handling
 * 
 * IMPORTANT: Preserve original column names (case-sensitive)
 * The schema validator needs exact column names from Millenium export
 */
function normalizeRowData(row: any): RowData {
  const normalized: any = {};

  for (const [key, value] of Object.entries(row)) {
    // Keep original key name - don't lowercase!
    const cleanKey = key.trim();

    if (value === null || value === undefined || value === '') {
      normalized[cleanKey] = null;
    } else if (typeof value === 'number') {
      normalized[cleanKey] = value;
    } else if (typeof value === 'string') {
      const trimmed = value.trim();

      // Don't convert certain fields to numbers - they need to stay as strings
      // CFOP has dots and must preserve format (5.101 not 5.1)
      // CPF/CNPJ have dots/slashes/dashes
      if (
        cleanKey === 'Cfop' ||
        cleanKey === 'Série' ||
        cleanKey === 'Cnpj/Cpf Destinatário' ||
        cleanKey === 'Inscr. Estadual Destinatário' ||
        cleanKey === 'Chave NFe'
      ) {
        normalized[cleanKey] = trimmed;
      } else {
        // Try to parse other fields as numbers
        const asNumber = parseFloat(trimmed);
        if (!isNaN(asNumber) && trimmed !== '') {
          normalized[cleanKey] = asNumber;
        } else {
          normalized[cleanKey] = trimmed;
        }
      }
    } else {
      normalized[cleanKey] = value;
    }
  }

  return normalized as RowData;
}

/**
 * Get supported file extensions
 */
export function getSupportedFormats(): string[] {
  return ['.xlsx', '.csv', '.ods'];
}

/**
 * Validate file extension
 */
export function isValidFileFormat(fileName: string): boolean {
  const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  return getSupportedFormats().includes(ext);
}
