export interface ExcelInvoiceRecord {
  invoiceNumber: string;
  issuerIdentifier: string;
  issueDate: string;
  supplierName: string;
  totalAmount?: number;
  rawRowData: Record<string, unknown>;
}

export interface XmlInvoiceRecord {
  invoiceNumber: string;
  issuerIdentifier: string;
  fileName: string;
  compositeKey: string;
}

export interface ReconciliationResult {
  totalAnalyzableExcelRows: number;
  totalImportedXmls: number;
  totalLaunchedXmls: number;
  missingImportedInvoices: ExcelInvoiceRecord[];
  missingLaunchedInvoices: ExcelInvoiceRecord[];
}
