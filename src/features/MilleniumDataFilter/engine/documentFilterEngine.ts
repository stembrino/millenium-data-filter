/**
 * CPF/CNPJ document-type filter engine.
 * Filters by document category instead of listing all raw document values.
 */

import type { RowData } from '../types/milenium';
import { validateCPFCNPJ } from './schemaValidator';

export type DocumentType = 'cpf' | 'cnpj';

export interface DocumentSummary {
  documentType: DocumentType;
  count: number;
  totalValue: number;
  rows: RowData[];
}

export function extractUniqueDocumentTypes(data: RowData[]): DocumentType[] {
  const documentTypes = new Set<DocumentType>();

  data.forEach((row) => {
    const rawValue = row['Cnpj/Cpf Destinatário'];
    if (rawValue === null || rawValue === undefined) {
      return;
    }

    const validation = validateCPFCNPJ(String(rawValue));
    if (validation.isValid && validation.documentType !== 'unknown') {
      documentTypes.add(validation.documentType);
    }
  });

  return Array.from(documentTypes).sort((a, b) => a.localeCompare(b));
}

export function filterByDocumentTypes(
  data: RowData[],
  selectedDocumentTypes: DocumentType[]
): DocumentSummary[] {
  const typesToProcess =
    selectedDocumentTypes.length === 0
      ? extractUniqueDocumentTypes(data)
      : selectedDocumentTypes;

  const summaryMap = new Map<DocumentType, DocumentSummary>();

  typesToProcess.forEach((documentType) => {
    summaryMap.set(documentType, {
      documentType,
      count: 0,
      totalValue: 0,
      rows: [],
    });
  });

  data.forEach((row) => {
    const rawValue = row['Cnpj/Cpf Destinatário'];
    if (rawValue === null || rawValue === undefined) {
      return;
    }

    const validation = validateCPFCNPJ(String(rawValue));
    if (!validation.isValid || validation.documentType === 'unknown') {
      return;
    }

    if (!typesToProcess.includes(validation.documentType)) {
      return;
    }

    const summary = summaryMap.get(validation.documentType);
    if (!summary) {
      return;
    }

    summary.count += 1;
    summary.rows.push(row);

    const valor = row['Valor'];
    if (typeof valor === 'number') {
      summary.totalValue += valor;
    } else if (typeof valor === 'string') {
      const parsed = parseFloat(valor.replace(',', '.'));
      if (!isNaN(parsed)) {
        summary.totalValue += parsed;
      }
    }
  });

  return Array.from(summaryMap.values()).sort((a, b) =>
    a.documentType.localeCompare(b.documentType)
  );
}
