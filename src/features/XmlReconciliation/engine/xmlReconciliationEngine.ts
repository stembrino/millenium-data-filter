import type {
  ExcelInvoiceRecord,
  ReconciliationResult,
  XmlInvoiceRecord,
} from "../types/reconciliation";

export const runReconciliation = (
  excelRecords: ExcelInvoiceRecord[],
  importedXmls: XmlInvoiceRecord[],
  launchedXmls: XmlInvoiceRecord[],
  includeToday = false,
): ReconciliationResult => {
  const todayDateString = new Date().toISOString().split("T")[0];

  const filteredExcelRecords = includeToday
    ? excelRecords
    : excelRecords.filter((record) => record.issueDate !== todayDateString);

  const importedKeysSet = new Set(importedXmls.map((xml) => xml.compositeKey));
  const launchedKeysSet = new Set(launchedXmls.map((xml) => xml.compositeKey));
  const hasImportedXmls = importedXmls.length > 0;
  const hasLaunchedXmls = launchedXmls.length > 0;

  const missingImportedInvoices: ExcelInvoiceRecord[] = [];
  const missingLaunchedInvoices: ExcelInvoiceRecord[] = [];

  for (const record of filteredExcelRecords) {
    const recordKey = record.compositeKey;

    if (hasImportedXmls && !importedKeysSet.has(recordKey)) {
      missingImportedInvoices.push(record);
    }

    if (hasLaunchedXmls && !launchedKeysSet.has(recordKey)) {
      missingLaunchedInvoices.push(record);
    }
  }

  return {
    totalAnalyzableExcelRows: filteredExcelRecords.length,
    totalImportedXmls: importedXmls.length,
    totalLaunchedXmls: launchedXmls.length,
    missingImportedInvoices,
    missingLaunchedInvoices,
  };
};
