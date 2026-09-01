/**
 * Document Filter Engine Tests
 */

import { describe, expect, it } from 'vitest';
import {
  extractUniqueDocumentTypes,
  filterByDocumentTypes,
} from '../features/MilleniumDataFilter/engine/documentFilterEngine';
import type { RowData } from '../features/MilleniumDataFilter/types/milenium';

const sampleData: RowData[] = [
  {
    'Cnpj/Cpf Destinatário': '111.444.777-35',
    Cfop: '5.101',
    Valor: 1000,
  },
  {
    'Cnpj/Cpf Destinatário': '111.444.777-35',
    Cfop: '6.101',
    Valor: 500,
  },
  {
    'Cnpj/Cpf Destinatário': '22.333.444/0001-55',
    Cfop: '5.209',
    Valor: 2000,
  },
  {
    'Cnpj/Cpf Destinatário': '22.333.444/0001-55',
    Cfop: '5.101',
    Valor: 300,
  },
];

describe('documentFilterEngine', () => {
  it('extracts unique document types without duplicates', () => {
    expect(extractUniqueDocumentTypes(sampleData)).toEqual(['cnpj', 'cpf']);
  });

  it('aggregates rows by selected CPF/CNPJ types', () => {
    const result = filterByDocumentTypes(sampleData, ['cpf']);

    expect(result).toHaveLength(1);
    expect(result[0].documentType).toBe('cpf');
    expect(result[0].count).toBe(2);
    expect(result[0].totalValue).toBe(1500);
  });
});
