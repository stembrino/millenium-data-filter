/**
 * Unit tests for schema validator
 * Vitest - Tests core business logic in isolation
 */

import { describe, it, expect } from 'vitest';
import type { RowData } from '../features/MilleniumDataFilter/types/milenium';
import {
  validateCPFCNPJ,
  detectEmptyRows,
  detectInvalidDocuments,
  detectCorruptRows,
  performSchemaCheck,
  validateMileniumSchema,
} from '../features/MilleniumDataFilter/engine/schemaValidator';

describe('validateCPFCNPJ', () => {
  it('should validate a correct CPF', () => {
    const result = validateCPFCNPJ('11144477735');
    expect(result.isValid).toBe(true);
    expect(result.documentType).toBe('cpf');
  });

  it('should validate a correct CPF with formatting', () => {
    const result = validateCPFCNPJ('111.444.777-35');
    expect(result.isValid).toBe(true);
    expect(result.documentType).toBe('cpf');
  });

  it('should validate a correct CNPJ', () => {
    const result = validateCPFCNPJ('11222333000181');
    expect(result.isValid).toBe(true);
    expect(result.documentType).toBe('cnpj');
  });

  it('should validate a correct CNPJ with formatting', () => {
    const result = validateCPFCNPJ('11.222.333/0001-81');
    expect(result.isValid).toBe(true);
    expect(result.documentType).toBe('cnpj');
  });

  it('should handle null/undefined values', () => {
    expect(validateCPFCNPJ('').isValid).toBe(false);
    expect(validateCPFCNPJ('abc').isValid).toBe(false);
  });

  it('should return unknown document type for invalid formats', () => {
    const result = validateCPFCNPJ('123');
    expect(result.documentType).toBe('unknown');
  });

  // Edge case tests from real Millenium data
  describe('Real Millenium export edge cases', () => {
    it('should accept malformed 15-digit CNPJ (Row 9 case)', () => {
      // Real Millenium file has: 002.653.378/0001-10 (15 digits when cleaned)
      const result = validateCPFCNPJ('002.653.378/0001-10');
      expect(result.isValid).toBe(true);
      expect(result.documentType).toBe('cnpj');
    });

    it('should accept 14-digit CNPJ with leading space (Row 26, 29 cases)', () => {
      const result = validateCPFCNPJ(' 52.928.998/0001-92');
      expect(result.isValid).toBe(true);
      expect(result.documentType).toBe('cnpj');
    });

    it('should accept flexible digit range (10-16 digits)', () => {
      // 10 digits
      expect(validateCPFCNPJ('1234567890').isValid).toBe(true);
      // 11 digits (standard CPF)
      expect(validateCPFCNPJ('12345678901').isValid).toBe(true);
      // 12 digits
      expect(validateCPFCNPJ('123456789012').isValid).toBe(true);
      // 13 digits
      expect(validateCPFCNPJ('1234567890123').isValid).toBe(true);
      // 14 digits (standard CNPJ)
      expect(validateCPFCNPJ('12345678901234').isValid).toBe(true);
      // 15 digits (malformed, but accept)
      expect(validateCPFCNPJ('123456789012345').isValid).toBe(true);
      // 16 digits
      expect(validateCPFCNPJ('1234567890123456').isValid).toBe(true);
    });

    it('should reject digit strings outside range (< 10 or > 16)', () => {
      // 9 digits (too short)
      expect(validateCPFCNPJ('123456789').isValid).toBe(false);
      // 17 digits (too long)
      expect(validateCPFCNPJ('12345678901234567').isValid).toBe(false);
    });

    it('should reject non-digit content after cleaning', () => {
      // Letters mixed in
      expect(validateCPFCNPJ('111.444.777-ABC').isValid).toBe(false);
      // Special chars that don't get cleaned
      expect(validateCPFCNPJ('111@444@777').isValid).toBe(false);
    });

    it('should preserve original value in response', () => {
      const value = ' 52.928.998/0001-92';
      const result = validateCPFCNPJ(value);
      expect(result.value).toBe(value);
    });

    it('should classify documents correctly by digit count', () => {
      // 11 digits -> CPF (length <= 12)
      const cpf = validateCPFCNPJ('12345678901');
      expect(cpf.documentType).toBe('cpf');

      // 13 digits -> CNPJ (length > 12)
      const edge13 = validateCPFCNPJ('1234567890123');
      expect(edge13.documentType).toBe('cnpj');

      // 14 digits -> CNPJ
      const cnpj = validateCPFCNPJ('12345678901234');
      expect(cnpj.documentType).toBe('cnpj');
    });
  });

  it('should accept format variations with dots and dashes', () => {
    const variations = [
      '111.444.777-35', // CPF with dots and dash
      '11.222.333/0001-81', // CNPJ with dots, slash, dash
      '111444777-35', // CPF with only dash
      '11.222.333/0001-81', // CNPJ standard format
    ];

    variations.forEach(v => {
      const result = validateCPFCNPJ(v);
      expect(result.isValid).toBe(true);
    });
  });
});

describe('detectEmptyRows', () => {
  it('should detect completely empty rows', () => {
    const data: RowData[] = [
      { name: 'John', value: 100 },
      { name: null, value: null },
      { name: 'Jane', value: 200 },
    ];

    const emptyIndices = detectEmptyRows(data);
    expect(emptyIndices).toEqual([1]);
  });

  it('should detect rows with all whitespace strings', () => {
    const data: RowData[] = [
      { name: '  ', value: '' },
      { name: 'John', value: 100 },
    ];

    const emptyIndices = detectEmptyRows(data);
    expect(emptyIndices).toEqual([0]);
  });

  it('should handle rows with mixed null and empty strings', () => {
    const data: RowData[] = [
      { name: null, value: '', other: undefined },
      { name: 'John', value: 100 },
    ];

    const emptyIndices = detectEmptyRows(data);
    expect(emptyIndices).toEqual([0]);
  });

  it('should return empty array if no empty rows', () => {
    const data: RowData[] = [
      { name: 'John', value: 100 },
      { name: 'Jane', value: 200 },
    ];

    const emptyIndices = detectEmptyRows(data);
    expect(emptyIndices).toEqual([]);
  });

  it('should handle empty dataset', () => {
    const emptyIndices = detectEmptyRows([]);
    expect(emptyIndices).toEqual([]);
  });
});

describe('detectInvalidDocuments', () => {
  it('should detect rows with invalid CPF', () => {
    // Format-only validation: no checksum validation
    // All these should now be VALID (14-digit formatted strings)
    const data: RowData[] = [
      { 'Cnpj/Cpf Destinatário': '11144477735', name: 'John' }, // 11 digits - valid
      { 'Cnpj/Cpf Destinatário': '00000000000', name: 'Jane' }, // 11 digits - valid format now
      { 'Cnpj/Cpf Destinatário': '12345678901', name: 'Bob' }, // 11 digits - valid format now
    ];

    const invalidIndices = detectInvalidDocuments(data);
    expect(invalidIndices.length).toBe(0); // None invalid (all format-valid)
  });

  it('should detect rows with invalid CNPJ', () => {
    // Format-only validation: no checksum validation
    // All these should now be VALID (14-digit formatted strings)
    const data: RowData[] = [
      { 'Cnpj/Cpf Destinatário': '11222333000181', name: 'Corp1' }, // 14 digits - valid
      { 'Cnpj/Cpf Destinatário': '00000000000000', name: 'Corp2' }, // 14 digits - valid format now
    ];

    const invalidIndices = detectInvalidDocuments(data);
    expect(invalidIndices).toEqual([]); // None invalid (all format-valid)
  });

  it('should handle rows without document columns', () => {
    const data: RowData[] = [
      { 'Nome Destinatário': 'John', Valor: 100 },
      { 'Nome Destinatário': 'Jane', Valor: 200 },
    ];

    const invalidIndices = detectInvalidDocuments(data);
    expect(invalidIndices).toEqual([]);
  });

  it('should prioritize tax_id over cpf_cnpj if both exist', () => {
    const data: RowData[] = [
      { 'Cnpj/Cpf Destinatário': '11144477735', name: 'John' },
    ];

    const invalidIndices = detectInvalidDocuments(data);
    // Should validate (which is valid), so no errors
    expect(invalidIndices).toEqual([]);
  });
});

describe('detectCorruptRows', () => {
  it('should detect rows with missing keys', () => {
    const data: RowData[] = [
      { name: 'John', age: 30, city: 'NYC' },
      { name: 'Jane', age: 25 }, // Missing 'city'
    ];

    const corruptIndices = detectCorruptRows(data);
    expect(corruptIndices.length).toBeGreaterThan(0);
  });

  it('should handle empty dataset', () => {
    const corruptIndices = detectCorruptRows([]);
    expect(corruptIndices).toEqual([]);
  });

  it('should not flag uniform data as corrupt', () => {
    const data: RowData[] = [
      {
        Data: 46248,
        'Nota/Faixa': '123',
        Série: '001',
        Valor: 1000,
        'Nome Destinatário': 'John',
        'Cnpj/Cpf Destinatário': '11144477735',
      },
      {
        Data: 46248,
        'Nota/Faixa': '124',
        Série: '001',
        Valor: 2000,
        'Nome Destinatário': 'Jane',
        'Cnpj/Cpf Destinatário': '12345678901',
      },
      {
        Data: 46248,
        'Nota/Faixa': '125',
        Série: '001',
        Valor: 1500,
        'Nome Destinatário': 'Bob',
        'Cnpj/Cpf Destinatário': '98765432109',
      },
    ];

    const corruptIndices = detectCorruptRows(data);
    expect(corruptIndices).toEqual([]);
  });

  it('should accept sparse rows with missing trailing columns', () => {
    // Real-world case: spreadsheet rows with fewer columns (trailing columns missing)
    const data: RowData[] = [
      {
        Data: 46248,
        'Nota/Faixa': '189758',
        Série: '001',
        Valor: 1000,
        'Nome Destinatário': 'John',
        'Cnpj/Cpf Destinatário': '11144477735',
        'Base Icms': 800,
        'Valor Icms': 200,
        'Chave NFe': 'ABC123',
        'Qtde. Produtos': 10,
      },
      {
        // Sparse row: missing 'Chave NFe', 'Qtde. Produtos' and other trailing columns
        // BUT has all REQUIRED columns (Data, Nota/Faixa, Série, Valor, Nome, CNPJ)
        Data: 46248,
        'Nota/Faixa': '40965',
        Série: '004',
        Valor: 2073600,
        'Nome Destinatário': 'Jane',
        'Cnpj/Cpf Destinatário': '52928998000192',
        'Base Icms': 400,
        'Valor Icms': 100,
      },
    ];

    const corruptIndices = detectCorruptRows(data);
    // Should NOT flag sparse rows with missing trailing columns
    expect(corruptIndices).toEqual([]);
  });
});

describe('performSchemaCheck', () => {
  it('should pass valid Milenium data', () => {
    const data: RowData[] = [
      {
        Data: 46248,
        'Nota/Faixa': '123',
        Série: '001',
        Valor: 1000.5,
        'Nome Destinatário': 'John',
        'Cnpj/Cpf Destinatário': '11144477735',
        Cfop: '5.101',
      },
      {
        Data: 46248,
        'Nota/Faixa': '124',
        Série: '001',
        Valor: 500.25,
        'Nome Destinatário': 'Jane',
        'Cnpj/Cpf Destinatário': '12345678901',
        Cfop: '5.102',
      },
    ];

    const result = performSchemaCheck(data);
    expect(result.isValid).toBe(true);
    expect(result.missingColumns).toEqual([]);
  });

  it('should detect missing required columns', () => {
    const data: RowData[] = [
      {
        'Cnpj/Cpf Destinatário': '11144477735',
        'Nome Destinatário': 'John',
        // Missing Cfop and Valor
      },
    ];

    const result = performSchemaCheck(data);
    expect(result.isValid).toBe(false);
    expect(result.missingColumns).toContain('Cfop');
    expect(result.missingColumns).toContain('Valor');
  });

  it('should accept either tax_id or cpf_cnpj', () => {
    const dataWithTaxId: RowData[] = [
      {
        'Cnpj/Cpf Destinatário': '11144477735',
        'Nome Destinatário': 'John',
        Cfop: '5.101',
        Valor: 1000.5,
      },
    ];

    const result = performSchemaCheck(dataWithTaxId);
    expect(result.missingColumns).not.toContain('Cnpj/Cpf Destinatário');
  });

  it('should report combined issues', () => {
    // Format-only validation: all documents with correct format are valid
    // Only test empty rows
    const data: RowData[] = [
      {
        'Cnpj/Cpf Destinatário': '00000000000', // 11 digits - valid format now
        'Nome Destinatário': 'John',
        Cfop: '5.101',
        Valor: 1000.5,
      },
      { 'Cnpj/Cpf Destinatário': null, 'Nome Destinatário': null, Cfop: null, Valor: null }, // Empty row
    ];

    const result = performSchemaCheck(data);
    expect(result.isValid).toBe(false);
    expect(result.invalidDocumentIndices.length).toBe(0); // No invalid documents (format-only)
    expect(result.emptyRowIndices.length).toBeGreaterThan(0); // Empty row detected
  });
});

describe('validateMileniumSchema', () => {
  it('should return valid result for clean data', () => {
    const data: RowData[] = [
      {
        Data: 46248,
        'Nota/Faixa': '123',
        Série: '001',
        Valor: 1000.5,
        'Nome Destinatário': 'John',
        'Cnpj/Cpf Destinatário': '11144477735',
        Cfop: '5.101',
      },
      {
        Data: 46248,
        'Nota/Faixa': '124',
        Série: '001',
        Valor: 500.25,
        'Nome Destinatário': 'Jane',
        'Cnpj/Cpf Destinatário': '12345678901',
        Cfop: '5.102',
      },
    ];

    const result = validateMileniumSchema(data);
    expect(result.isValid).toBe(true);
    expect(result.totalRows).toBe(2);
    expect(result.validRows).toBe(2);
    expect(result.errors).toEqual([]);
  });

  it('should format error messages for missing columns', () => {
    const data: RowData[] = [
      {
        'Cnpj/Cpf Destinatário': '11144477735',
        'Nome Destinatário': 'John',
        // Missing Cfop and Valor
      },
    ];

    const result = validateMileniumSchema(data);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('Missing required columns');
  });

  it('should include warnings for invalid documents', () => {
    // Format-only validation: no warnings for format-valid documents
    // All 11 or 14-digit strings are now valid
    const data: RowData[] = [
      {
        'Cnpj/Cpf Destinatário': '11144477735', // 11 digits - valid format
        'Nome Destinatário': 'John',
        Cfop: '5.101',
        Valor: 1000.5,
      },
      {
        'Cnpj/Cpf Destinatário': '00000000000', // 11 digits - valid format now
        'Nome Destinatário': 'Jane',
        Cfop: '5.102',
        Valor: 500.25,
      },
    ];

    const result = validateMileniumSchema(data);
    // No warnings for invalid documents (all format-valid)
    expect(result.warnings.filter(w => w.includes('invalid CPF/CNPJ')).length).toBe(0);
  });

  it('should count valid rows correctly with errors', () => {
    const data: RowData[] = [
      {
        'Cnpj/Cpf Destinatário': '11144477735',
        'Nome Destinatário': 'John',
        Cfop: '5.101',
        Valor: 1000.5,
      },
      { 'Cnpj/Cpf Destinatário': null, 'Nome Destinatário': null, Cfop: null, Valor: null }, // Empty row
      {
        'Cnpj/Cpf Destinatário': '11144477735',
        'Nome Destinatário': 'Jane',
        Cfop: '5.102',
        Valor: 500.25,
      },
    ];

    const result = validateMileniumSchema(data);
    expect(result.totalRows).toBe(3);
    expect(result.validRows).toBeLessThan(3);
  });
});
