/**
 * Preset Engine Tests - Core aggregation and filtering logic
 */

import { describe, it, expect } from 'vitest';
import {
  executeTotalByTaxId,
  executeTotalByBranch,
  executeHideZeroStock,
  executeInvalidDocumentCheck,
  executePreset,
} from '../engine/presetEngine';
import type { RowData } from '../types/milenium';

const sampleData: RowData[] = [
  {
    tax_id: '12345678000100',
    cpf_cnpj: '12345678000100',
    branch_id: '01',
    filial: '01',
    product_code: 'PROD001',
    total_amount: 1000,
    stock_qty: 10,
  },
  {
    tax_id: '12345678000100',
    cpf_cnpj: '12345678000100',
    branch_id: '01',
    filial: '01',
    product_code: 'PROD002',
    total_amount: 500,
    stock_qty: 5,
  },
  {
    tax_id: '98765432000199',
    cpf_cnpj: '98765432000199',
    branch_id: '02',
    filial: '02',
    product_code: 'PROD001',
    total_amount: 2000,
    stock_qty: 0,
  },
  {
    tax_id: '98765432000199',
    cpf_cnpj: '98765432000199',
    branch_id: '02',
    filial: '02',
    product_code: 'PROD003',
    total_amount: 1500,
    stock_qty: 8,
  },
];

describe('Preset Engine - Aggregation & Filtering', () => {
  describe('executeTotalByTaxId', () => {
    it('should group rows by tax_id and sum amounts', () => {
      const result = executeTotalByTaxId(sampleData);

      expect(result.success).toBe(true);
      expect(result.rowsResult).toBe(2);
      expect(result.data).toHaveLength(2);
      expect(result.data[0].total_amount).toBe(1500); // 1000 + 500
      expect(result.data[1].total_amount).toBe(3500); // 2000 + 1500
    });

    it('should calculate correct summary', () => {
      const result = executeTotalByTaxId(sampleData);

      expect(result.summary.unique_documents).toBe(2);
      expect(result.summary.total_sum).toBe(5000);
    });

    it('should handle empty data', () => {
      const result = executeTotalByTaxId([]);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(0);
    });
  });

  describe('executeTotalByBranch', () => {
    it('should group rows by branch_id and sum amounts', () => {
      const result = executeTotalByBranch(sampleData);

      expect(result.success).toBe(true);
      expect(result.rowsResult).toBe(2);
      expect(result.data).toHaveLength(2);
      expect(result.data[0].total_amount).toBe(1500); // 1000 + 500
      expect(result.data[1].total_amount).toBe(3500); // 2000 + 1500
    });

    it('should calculate correct summary', () => {
      const result = executeTotalByBranch(sampleData);

      expect(result.summary.unique_branches).toBe(2);
      expect(result.summary.total_sum).toBe(5000);
    });
  });

  describe('executeHideZeroStock', () => {
    it('should remove rows with zero or negative stock', () => {
      const result = executeHideZeroStock(sampleData);

      expect(result.success).toBe(true);
      expect(result.rowsResult).toBe(3); // 4 - 1 (zero stock)
      expect(result.data).toHaveLength(3);
      expect(result.summary.rows_removed).toBe(1);
    });

    it('should preserve rows with positive stock', () => {
      const result = executeHideZeroStock(sampleData);

      const hasZeroStock = result.data.some((row) => row.stock_qty === 0);
      expect(hasZeroStock).toBe(false);
    });
  });

  describe('executeInvalidDocumentCheck', () => {
    it('should filter rows without valid documents', () => {
      const testData: RowData[] = [
        { tax_id: '12345678000100', cpf_cnpj: '12345678000100' },
        { tax_id: '', cpf_cnpj: '' },
        { tax_id: '98765432000199', cpf_cnpj: '98765432000199' },
      ];

      const result = executeInvalidDocumentCheck(testData);

      expect(result.success).toBe(true);
      expect(result.rowsResult).toBe(2);
      expect(result.summary.invalid_rows_removed).toBe(1);
    });
  });

  describe('executePreset', () => {
    it('should execute TOTAL_BY_TAX_ID preset', () => {
      const result = executePreset('TOTAL_BY_TAX_ID', sampleData);

      expect(result.preset).toBe('TOTAL_BY_TAX_ID');
      expect(result.success).toBe(true);
      expect(result.rowsResult).toBe(2);
    });

    it('should execute TOTAL_BY_BRANCH preset', () => {
      const result = executePreset('TOTAL_BY_BRANCH', sampleData);

      expect(result.preset).toBe('TOTAL_BY_BRANCH');
      expect(result.success).toBe(true);
      expect(result.rowsResult).toBe(2);
    });

    it('should execute HIDE_ZERO_STOCK preset', () => {
      const result = executePreset('HIDE_ZERO_STOCK', sampleData);

      expect(result.preset).toBe('HIDE_ZERO_STOCK');
      expect(result.success).toBe(true);
      expect(result.rowsResult).toBe(3);
    });

    it('should execute INVALID_DOCUMENT_CHECK preset', () => {
      const result = executePreset('INVALID_DOCUMENT_CHECK', sampleData);

      expect(result.preset).toBe('INVALID_DOCUMENT_CHECK');
      expect(result.success).toBe(true);
      expect(result.rowsResult).toBe(4); // All have valid docs
    });

    it('should return error for unknown preset', () => {
      const result = executePreset('UNKNOWN_PRESET', sampleData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown preset');
    });

    it('should handle empty data gracefully', () => {
      const result = executePreset('TOTAL_BY_TAX_ID', []);

      expect(result.success).toBe(false);
      expect(result.error).toBe('No data provided');
    });
  });

  describe('Edge Cases & Data Coercion', () => {
    it('should handle string numbers in total_amount', () => {
      const testData: RowData[] = [
        {
          tax_id: '12345678000100',
          cpf_cnpj: '12345678000100',
          total_amount: '1500.50',
          stock_qty: 10,
        },
        {
          tax_id: '12345678000100',
          cpf_cnpj: '12345678000100',
          total_amount: '999.75',
          stock_qty: 5,
        },
      ];

      const result = executeTotalByTaxId(testData);

      expect(result.success).toBe(true);
      expect(result.data[0].total_amount).toBe(2500.25);
    });

    it('should handle null/undefined amounts', () => {
      const testData: RowData[] = [
        {
          tax_id: '12345678000100',
          cpf_cnpj: '12345678000100',
          total_amount: null,
        },
        {
          tax_id: '12345678000100',
          cpf_cnpj: '12345678000100',
          total_amount: 1000,
        },
      ];

      const result = executeTotalByTaxId(testData);

      expect(result.success).toBe(true);
      expect(result.data[0].total_amount).toBe(1000);
    });

    it('should handle missing stock_qty (default to no stock)', () => {
      const testData: RowData[] = [
        { stock_qty: 10 },
        { stock_qty: null },
        { stock_qty: undefined },
      ];

      const result = executeHideZeroStock(testData);

      expect(result.rowsResult).toBe(1); // Only first row kept
    });
  });

  describe('Performance', () => {
    it('should handle large datasets efficiently', () => {
      const largeData: RowData[] = [];
      for (let i = 0; i < 10000; i++) {
        largeData.push({
          tax_id: `DOC${i % 100}`,
          cpf_cnpj: `DOC${i % 100}`,
          branch_id: `BRANCH${i % 10}`,
          filial: `BRANCH${i % 10}`,
          total_amount: Math.random() * 10000,
          stock_qty: Math.random() * 100,
        });
      }

      const start = performance.now();
      const result = executeTotalByTaxId(largeData);
      const duration = performance.now() - start;

      expect(result.success).toBe(true);
      expect(duration).toBeLessThan(50); // Should complete in < 50ms
    });
  });
});
