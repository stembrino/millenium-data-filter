export interface ExcelInvoiceRecord {
  invoiceNumber: string; // Cleaned "Num NFe"
  issuerCnpj: string; // Digits-only "CNPJ Emit"
  issuerName: string; // "Razao Soc. Emit"
  issueDate: string; // ISO format YYYY-MM-DD
  totalAmount?: number; // "Valor"
  nfeKey?: string; // "Chave da NFe"
  compositeKey: string; // `${invoiceNumber}_${issuerCnpj}`
  rawRowData: Record<string, unknown>; // Original SIEG row preserved for export
}

export interface XmlInvoiceRecord {
  invoiceNumber: string;
  issuerCnpj: string;
  issuerName: string;
  issueDate: string; // ISO format YYYY-MM-DD
  fileName: string;
  nfeKey?: string;
  compositeKey: string; // `${invoiceNumber}_${issuerCnpj}`
}

export interface ReconciliationResult {
  totalAnalyzableExcelRows: number;
  totalImportedXmls: number;
  totalLaunchedXmls: number;
  missingImportedInvoices: ExcelInvoiceRecord[];
  missingLaunchedInvoices: ExcelInvoiceRecord[];
}
