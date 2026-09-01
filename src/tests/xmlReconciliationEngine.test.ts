import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";
import { parseExcelFile } from "../features/XmlReconciliation/engine/excelParser";
import { parseXmlFile } from "../features/XmlReconciliation/engine/xmlParser";
import { runReconciliation } from "../features/XmlReconciliation/engine/xmlReconciliationEngine";
import type { ExcelInvoiceRecord } from "../features/XmlReconciliation/types/reconciliation";

describe("XML Reconciliation engine", () => {
  it("maps SIEG rows to the composite key format used by XMLs", () => {
    const excelRows: ExcelInvoiceRecord[] = [
      {
        invoiceNumber: "995",
        issuerCnpj: "57920024000186",
        issuerName: "ANDREIA VAZ DOS SANTOS CONFECCCOES",
        issueDate: "2026-08-27",
        totalAmount: 24480,
        nfeKey: "43260199500000123456789012345678901234567890",
        compositeKey: "995_57920024000186",
        rawRowData: {
          "Num NFe": "000995",
          "CNPJ Emit": "57.920.024/0001-86",
          "Razao Soc. Emit": "ANDREIA VAZ DOS SANTOS CONFECCCOES",
          "Data Emissao": "27/08/2026",
          "Valor": 24480,
          "Chave da NFe": "43260199500000123456789012345678901234567890",
        },
      },
    ];

    const importedXmls = [
      {
        invoiceNumber: "995",
        issuerCnpj: "57920024000186",
        issuerName: "ANDREIA VAZ DOS SANTOS CONFECCCOES",
        issueDate: "2026-08-27",
        fileName: "nfe-995.xml",
        nfeKey: "43260199500000123456789012345678901234567890",
        compositeKey: "995_57920024000186",
      },
    ];

    const result = runReconciliation(excelRows, importedXmls, []);

    expect(result.totalAnalyzableExcelRows).toBe(1);
    expect(result.missingImportedInvoices).toHaveLength(0);
    expect(result.missingLaunchedInvoices).toHaveLength(1);
  });

  it("ignores rows with the current date and preserves the original Excel data", () => {
    const today = new Date().toISOString().slice(0, 10);
    const excelRows: ExcelInvoiceRecord[] = [
      {
        invoiceNumber: "995",
        issuerCnpj: "57920024000186",
        issuerName: "ANDREIA VAZ DOS SANTOS CONFECCCOES",
        issueDate: today,
        totalAmount: 24480,
        rawRowData: { "Num NFe": "000995", "CNPJ Emit": "57.920.024/0001-86" },
        compositeKey: "995_57920024000186",
      },
      {
        invoiceNumber: "996",
        issuerCnpj: "57920024000186",
        issuerName: "ANDREIA VAZ DOS SANTOS CONFECCCOES",
        issueDate: "2026-08-28",
        totalAmount: 999,
        rawRowData: { "Num NFe": "000996", "CNPJ Emit": "57.920.024/0001-86" },
        compositeKey: "996_57920024000186",
      },
    ];

    const result = runReconciliation(excelRows, [], []);

    expect(result.totalAnalyzableExcelRows).toBe(1);
    expect(result.missingImportedInvoices).toHaveLength(1);
    expect(result.missingImportedInvoices[0].rawRowData["Num NFe"]).toBe("000996");
  });

  it("includes the current day when the user explicitly enables it", () => {
    const today = new Date().toISOString().slice(0, 10);
    const excelRows: ExcelInvoiceRecord[] = [
      {
        invoiceNumber: "995",
        issuerCnpj: "57920024000186",
        issuerName: "ANDREIA VAZ DOS SANTOS CONFECCCOES",
        issueDate: today,
        totalAmount: 24480,
        rawRowData: { "Num NFe": "000995", "CNPJ Emit": "57.920.024/0001-86" },
        compositeKey: "995_57920024000186",
      },
      {
        invoiceNumber: "996",
        issuerCnpj: "57920024000186",
        issuerName: "ANDREIA VAZ DOS SANTOS CONFECCCOES",
        issueDate: "2026-08-28",
        totalAmount: 999,
        rawRowData: { "Num NFe": "000996", "CNPJ Emit": "57.920.024/0001-86" },
        compositeKey: "996_57920024000186",
      },
    ];

    const result = runReconciliation(excelRows, [], [], true);

    expect(result.totalAnalyzableExcelRows).toBe(2);
    expect(result.missingImportedInvoices).toHaveLength(2);
  });

  it("parses XML files into the exact SIEG-compatible fields", async () => {
    const xmlFile = new File(
      [
        `<?xml version="1.0" encoding="UTF-8"?>
        <nfeProc>
          <NFe>
            <infNFe>
              <ide>
                <nNF>000995</nNF>
              </ide>
              <emit>
                <CNPJ>57920024000186</CNPJ>
                <xNome>ANDREIA VAZ DOS SANTOS CONFECCCOES</xNome>
              </emit>
              <total>
                <ICMSTot>
                  <vNF>24480.00</vNF>
                </ICMSTot>
              </total>
            </infNFe>
            <Signature>
              <SignedInfo>
                <Reference URI="#">
                  <DigestValue>abc</DigestValue>
                </Reference>
              </SignedInfo>
            </Signature>
          </NFe>
          <protNFe>
            <infProt>
              <dhRecbto>2026-08-27T00:00:00-03:00</dhRecbto>
            </infProt>
          </protNFe>
          <infNFe Id="NFe43260199500000123456789012345678901234567890">
            <chNFe>43260199500000123456789012345678901234567890</chNFe>
          </infNFe>
        </nfeProc>`,
      ],
      "nfe.xml",
      { type: "application/xml" },
    );

    const parsed = await parseXmlFile(xmlFile);

    expect(parsed).not.toBeNull();
    expect(parsed?.invoiceNumber).toBe("995");
    expect(parsed?.issuerCnpj).toBe("57920024000186");
    expect(parsed?.issuerName).toBe("ANDREIA VAZ DOS SANTOS CONFECCCOES");
    expect(parsed?.compositeKey).toBe("995_57920024000186");
    expect(parsed?.nfeKey).toBe("43260199500000123456789012345678901234567890");
  });

  it("parses the SIEG Cofre Excel format into invoice records", async () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      ["", "Num NFe", "CNPJ Emit", "Razao Soc. Emit", "Data Emissao", "Valor", "Chave da NFe"],
      ["", "000995", "57.920.024/0001-86", "ANDREIA VAZ DOS SANTOS CONFECCCOES", "27/08/2026", 24480, "43260199500000123456789012345678901234567890"],
    ]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatorio de Xml's - Cofre");

    const rows = parseExcelFile(workbook);

    expect(rows).toHaveLength(1);
    expect(rows[0].invoiceNumber).toBe("995");
    expect(rows[0].issuerCnpj).toBe("57920024000186");
    expect(rows[0].issueDate).toBe("2026-08-27");
    expect(rows[0].compositeKey).toBe("995_57920024000186");
    expect(rows[0].rawRowData["Chave da NFe"]).toBe("43260199500000123456789012345678901234567890");
  });
});
