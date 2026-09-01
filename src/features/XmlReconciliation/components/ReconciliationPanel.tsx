import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { parseXmlFile } from "../engine/xmlParser";
import { runReconciliation } from "../engine/xmlReconciliationEngine";
import { XmlFileDropzone } from "./XmlFileDropzone";
import type {
  ExcelInvoiceRecord,
  XmlInvoiceRecord,
} from "../types/reconciliation";

const exampleExcelRows: ExcelInvoiceRecord[] = [
  {
    invoiceNumber: "000123",
    issuerIdentifier: "11222333000155",
    issueDate: "2026-08-29",
    supplierName: "Fornecedor A",
    totalAmount: 1500,
    rawRowData: { invoice: "000123" },
  },
  {
    invoiceNumber: "000456",
    issuerIdentifier: "99887766000144",
    issueDate: "2026-08-30",
    supplierName: "Fornecedor B",
    totalAmount: 2200,
    rawRowData: { invoice: "000456" },
  },
  {
    invoiceNumber: "100",
    issuerIdentifier: "11222333000155",
    issueDate: "2026-08-29",
    supplierName: "Fornecedor A",
    totalAmount: 999,
    rawRowData: { invoice: "100" },
  },
  {
    invoiceNumber: "100",
    issuerIdentifier: "99887766000144",
    issueDate: "2026-08-29",
    supplierName: "Fornecedor B",
    totalAmount: 777,
    rawRowData: { invoice: "100" },
  },
];

export function ReconciliationPanel() {
  const [excelRows, setExcelRows] =
    useState<ExcelInvoiceRecord[]>(exampleExcelRows);
  const [importedXmls, setImportedXmls] = useState<XmlInvoiceRecord[]>([]);
  const [launchedXmls, setLaunchedXmls] = useState<XmlInvoiceRecord[]>([]);
  const [importedFilesCount, setImportedFilesCount] = useState(0);
  const [launchedFilesCount, setLaunchedFilesCount] = useState(0);

  useEffect(() => {
    if (importedFilesCount === 0) {
      setImportedXmls([]);
    }
  }, [importedFilesCount]);

  useEffect(() => {
    if (launchedFilesCount === 0) {
      setLaunchedXmls([]);
    }
  }, [launchedFilesCount]);

  const reconciliation = useMemo(
    () => runReconciliation(excelRows, importedXmls, launchedXmls),
    [excelRows, importedXmls, launchedXmls],
  );

  const parseFiles = async (
    event: ChangeEvent<HTMLInputElement>,
    onResolve: (xmls: XmlInvoiceRecord[]) => void,
    onCount: (count: number) => void,
  ) => {
    const files = Array.from(event.target.files ?? []);
    const parsed = (
      await Promise.all(files.map((file) => parseXmlFile(file)))
    ).filter((value): value is XmlInvoiceRecord => value !== null);

    onResolve(parsed);
    onCount(files.length);
  };

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9333ea]">
            RELATÓRIO DE XML (EXCEL)
          </p>
          <XmlFileDropzone
            onFileSelect={(file) => {
              if (
                file.name.endsWith(".xlsx") ||
                file.name.endsWith(".xls") ||
                file.name.endsWith(".csv")
              ) {
                setExcelRows(exampleExcelRows);
              }
            }}
            compact
            accept=".xlsx,.xls,.csv"
            acceptText="Suportados: .xlsx, .xls, .csv (Máximo 10MB)"
          ></XmlFileDropzone>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9333ea]">
            XMLs Importados (Cofre.sieg)
          </p>
          <XmlFileDropzone
            backgroundColor="#cee2f4"
            onFileSelect={(file) => {
              void parseFiles(
                {
                  target: { files: [file] },
                } as ChangeEvent<HTMLInputElement>,
                setImportedXmls,
                setImportedFilesCount,
              );
            }}
            compact
            accept=".xml,application/xml,text/xml"
          >
            <p className="mt-1 text-left text-sm text-slate-600">
              {importedFilesCount > 0 &&
                `${importedFilesCount} arquivo(s) carregado(s)`}
            </p>
          </XmlFileDropzone>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9333ea]">
            Launched XMLs Lançados (G5)
          </p>
          <XmlFileDropzone
            backgroundColor="#cee2f4"
            onFileSelect={(file) => {
              void parseFiles(
                {
                  target: { files: [file] },
                } as ChangeEvent<HTMLInputElement>,
                setLaunchedXmls,
                setLaunchedFilesCount,
              );
            }}
            compact
            accept=".xml,application/xml,text/xml"
          >
            <p className="mt-1 text-left text-sm text-slate-600">
              {launchedFilesCount > 0 &&
                `${launchedFilesCount} arquivo(s) carregado(s)`}
            </p>
          </XmlFileDropzone>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Analyzable rows
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {reconciliation.totalAnalyzableExcelRows}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Imported XMLs
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {reconciliation.totalImportedXmls}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Launched XMLs
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {reconciliation.totalLaunchedXmls}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <h2 className="mb-3 text-lg font-semibold text-red-700">
            Missing in Imported XMLs
          </h2>
          <ul className="space-y-2 text-sm text-red-800">
            {reconciliation.missingImportedInvoices.length === 0 ? (
              <li>No missing invoices found.</li>
            ) : (
              reconciliation.missingImportedInvoices
                .slice(0, 10)
                .map((invoice, index) => (
                  <li
                    key={`${invoice.invoiceNumber}-${invoice.issuerIdentifier}-${index}`}
                    className="rounded-lg bg-white/70 px-3 py-2"
                  >
                    {invoice.invoiceNumber} • {invoice.issuerIdentifier} •{" "}
                    {invoice.issueDate}
                  </li>
                ))
            )}
          </ul>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="mb-3 text-lg font-semibold text-amber-700">
            Missing in Launched XMLs
          </h2>
          <ul className="space-y-2 text-sm text-amber-800">
            {reconciliation.missingLaunchedInvoices.length === 0 ? (
              <li>No missing invoices found.</li>
            ) : (
              reconciliation.missingLaunchedInvoices
                .slice(0, 10)
                .map((invoice, index) => (
                  <li
                    key={`${invoice.invoiceNumber}-${invoice.issuerIdentifier}-${index}`}
                    className="rounded-lg bg-white/70 px-3 py-2"
                  >
                    {invoice.invoiceNumber} • {invoice.issuerIdentifier} •{" "}
                    {invoice.issueDate}
                  </li>
                ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
