import * as XLSX from "xlsx";
import type { ExcelInvoiceRecord } from "../types/reconciliation";

const sanitizeInvoiceNumber = (value: unknown): string => {
  const parsed = String(value ?? "").replace(/[^\d]/g, "").replace(/^0+/, "");
  return parsed.trim();
};

const sanitizeCnpj = (value: unknown): string =>
  String(value ?? "").replace(/\D/g, "").trim();

const normalizeDate = (value: unknown): string => {
  const raw = String(value ?? "").trim();
  if (!raw) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
    const [day, month, year] = raw.split("/");
    return `${year}-${month}-${day}`;
  }

  const isoCandidate = new Date(raw);
  if (!Number.isNaN(isoCandidate.getTime())) {
    return isoCandidate.toISOString().split("T")[0];
  }

  return "";
};

const normalizeString = (value: unknown): string =>
  String(value ?? "").trim();

const buildCompositeKey = (invoiceNumber: string, issuerCnpj: string): string =>
  `${invoiceNumber}_${issuerCnpj}`;

const normalizeHeaderKey = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();

const findHeaderMap = (row: unknown[]): Record<string, number> => {
  const lookup: Record<string, number> = {};
  row.forEach((cell, index) => {
    const key = normalizeString(cell);
    if (!key) return;

    lookup[key] = index;
    lookup[normalizeHeaderKey(key)] = index;
  });
  return lookup;
};

export const parseExcelFile = (workbook: XLSX.WorkBook): ExcelInvoiceRecord[] => {
  const sheetName =
    workbook.SheetNames.find((name) =>
      name.includes("Relatorio de Xml's - Cofre"),
    ) ?? workbook.SheetNames[0];

  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];

  const rows = XLSX.utils.sheet_to_json<string[]>(sheet, {
    header: 1,
    raw: false,
  }) as string[][];

  if (rows.length === 0) return [];

  const headerRowIndex =
    rows.findIndex((row) =>
      row.some((cell) => {
        const key = normalizeHeaderKey(normalizeString(cell));
        return [
          "numnfe",
          "cnpjemit",
          "razaosocemit",
          "dataemissao",
          "valor",
          "chavedanfe",
        ].includes(key);
      }),
    ) ?? 0;

  const headerRow = rows[headerRowIndex] ?? rows[0];
  const headerMap = findHeaderMap(headerRow);

  const records: ExcelInvoiceRecord[] = [];

  for (let i = headerRowIndex + 1; i < rows.length; i += 1) {
    const row = rows[i];
    if (
      !row ||
      row.every(
        (cell) =>
          cell === undefined || cell === null || String(cell).trim() === "",
      )
    ) {
      continue;
    }

    const invoiceNumberCell =
      row[headerMap["Num NFe"] ?? headerMap["numnfe"] ?? 0] ?? "";
    const issuerCnpjCell =
      row[headerMap["CNPJ Emit"] ?? headerMap["cnpjemit"] ?? 1] ?? "";
    const issuerNameCell =
      row[headerMap["Razao Soc. Emit"] ?? headerMap["razaosocemit"] ?? 2] ?? "";
    const issueDateCell =
      row[headerMap["Data Emissao"] ?? headerMap["dataemissao"] ?? 3] ?? "";
    const totalAmountCell =
      row[headerMap["Valor"] ?? headerMap["valor"] ?? 4] ?? "";
    const nfeKeyCell =
      row[headerMap["Chave da NFe"] ?? headerMap["chavedanfe"] ?? 5] ?? "";

    const invoiceNumber = sanitizeInvoiceNumber(invoiceNumberCell);
    const issuerCnpj = sanitizeCnpj(issuerCnpjCell);

    if (!invoiceNumber || !issuerCnpj) continue;

    const record: ExcelInvoiceRecord = {
      invoiceNumber,
      issuerCnpj,
      issuerName: normalizeString(issuerNameCell).toUpperCase(),
      issueDate: normalizeDate(issueDateCell),
      totalAmount:
        Number.parseFloat(
          String(totalAmountCell).replace(".", "").replace(",", "."),
        ) || undefined,
      nfeKey: normalizeString(nfeKeyCell),
      compositeKey: buildCompositeKey(invoiceNumber, issuerCnpj),
      rawRowData: Object.fromEntries(
        headerRow.map((header, index) => [header, row[index] ?? ""]),
      ),
    };

    records.push(record);
  }

  return records;
};
