import type {
  ExcelInvoiceRecord,
  ReconciliationResult,
  XmlInvoiceRecord,
} from "../types/reconciliation";

export const parseExcludedDays = (value: string): number[] =>
  [...new Set(
    value
      .split(",")
      .map((part) => Number(part.trim()))
      .filter((day) => Number.isInteger(day) && day >= 1 && day <= 31),
  )].sort((firstDay, secondDay) => firstDay - secondDay);

export const runReconciliation = (
  excelRecords: ExcelInvoiceRecord[],
  importedXmls: XmlInvoiceRecord[],
  launchedXmls: XmlInvoiceRecord[],
  includeToday = false,
  excludedDays: number[] = [],
): ReconciliationResult => {
  const todayDateString = new Date().toISOString().split("T")[0];
  const excludedDaysSet = new Set(excludedDays);

  const filteredExcelRecords = excelRecords.filter((record) => {
    const dayOfMonth = Number(record.issueDate.split("-")[2]);
    const isToday = record.issueDate === todayDateString;
    const isExcludedDay = excludedDaysSet.has(dayOfMonth);

    return (includeToday || !isToday) && !isExcludedDay;
  });

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
