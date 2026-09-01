import { describe, expect, it } from "vitest";
import { parseXmlFile } from "../features/XmlReconciliation/engine/xmlParser";
import { runReconciliation } from "../features/XmlReconciliation/engine/xmlReconciliationEngine";
import type { ExcelInvoiceRecord } from "../features/XmlReconciliation/types/reconciliation";

describe("XML Reconciliation engine", () => {
  it("normalizes invoice numbers and matches composite keys", () => {
    const excelRows: ExcelInvoiceRecord[] = [
      {
        invoiceNumber: "000123",
        issuerIdentifier: "11222333000155",
        issueDate: "2026-08-29",
        supplierName: "Supplier A",
        rawRowData: {},
      },
    ];

    const importedXmls = [
      {
        invoiceNumber: "123",
        issuerIdentifier: "11222333000155",
        fileName: "nfe-123.xml",
        compositeKey: "123_11222333000155",
      },
    ];

    const result = runReconciliation(excelRows, importedXmls, []);

    expect(result.totalAnalyzableExcelRows).toBe(1);
    expect(result.missingImportedInvoices).toHaveLength(0);
    expect(result.missingLaunchedInvoices).toHaveLength(1);
  });

  it("keeps invoices with different suppliers separate even when invoice numbers match", () => {
    const excelRows: ExcelInvoiceRecord[] = [
      {
        invoiceNumber: "100",
        issuerIdentifier: "11222333000155",
        issueDate: "2026-08-29",
        supplierName: "Supplier A",
        rawRowData: {},
      },
      {
        invoiceNumber: "100",
        issuerIdentifier: "99887766000144",
        issueDate: "2026-08-29",
        supplierName: "Supplier B",
        rawRowData: {},
      },
    ];

    const importedXmls = [
      {
        invoiceNumber: "100",
        issuerIdentifier: "11222333000155",
        fileName: "first.xml",
        compositeKey: "100_11222333000155",
      },
    ];

    const result = runReconciliation(excelRows, importedXmls, []);

    expect(result.missingImportedInvoices).toHaveLength(1);
    expect(result.missingImportedInvoices[0].issuerIdentifier).toBe(
      "99887766000144",
    );
  });

  it("ignores rows with the current date", () => {
    const today = new Date().toISOString().slice(0, 10);
    const excelRows: ExcelInvoiceRecord[] = [
      {
        invoiceNumber: "00199",
        issuerIdentifier: "11222333000155",
        issueDate: today,
        supplierName: "Today Supplier",
        rawRowData: {},
      },
      {
        invoiceNumber: "00200",
        issuerIdentifier: "11222333000155",
        issueDate: "2026-08-28",
        supplierName: "Yesterday Supplier",
        rawRowData: {},
      },
    ];

    const result = runReconciliation(excelRows, [], []);

    expect(result.totalAnalyzableExcelRows).toBe(1);
    expect(result.missingImportedInvoices).toHaveLength(1);
    expect(result.missingImportedInvoices[0].invoiceNumber).toBe("200");
  });

  it("parses XML files into composite keys using NFe invoice and issuer data", async () => {
    const xmlFile = new File(
      [
        `<?xml version="1.0" encoding="UTF-8"?>
        <nfeProc>
          <NFe>
            <infNFe>
              <ide>
                <nNF>000123</nNF>
              </ide>
              <emit>
                <CNPJ>11222333000155</CNPJ>
                <xNome>Example Supplier</xNome>
              </emit>
            </infNFe>
          </NFe>
        </nfeProc>`,
      ],
      "nfe.xml",
      { type: "application/xml" },
    );

    const parsed = await parseXmlFile(xmlFile);

    expect(parsed).not.toBeNull();
    expect(parsed?.invoiceNumber).toBe("123");
    expect(parsed?.issuerIdentifier).toBe("11222333000155");
    expect(parsed?.compositeKey).toBe("123_11222333000155");
  });
});
