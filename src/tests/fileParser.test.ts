/**
 * File Parser Tests - Core functionality
 */

import { describe, it, expect } from 'vitest';
import { isValidFileFormat, getSupportedFormats } from '../engine/fileParser';

describe('File Parser - fileParser.ts', () => {
  describe('getSupportedFormats', () => {
    it('should return supported file formats', () => {
      const formats = getSupportedFormats();
      expect(formats).toEqual(['.xlsx', '.csv', '.ods']);
    });
  });

  describe('isValidFileFormat', () => {
    it('should validate .xlsx files', () => {
      expect(isValidFileFormat('data.xlsx')).toBe(true);
    });

    it('should validate .csv files', () => {
      expect(isValidFileFormat('data.csv')).toBe(true);
    });

    it('should validate .ods files', () => {
      expect(isValidFileFormat('data.ods')).toBe(true);
    });

    it('should reject invalid formats', () => {
      expect(isValidFileFormat('data.txt')).toBe(false);
      expect(isValidFileFormat('data.pdf')).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(isValidFileFormat('data.XLSX')).toBe(true);
      expect(isValidFileFormat('data.Csv')).toBe(true);
    });
  });
});
