import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { parseExcelFile } from "../engine/excelParser";
import { parseExcludedDays } from "../engine/xmlReconciliationEngine";
import { parseXmlFile } from "../engine/xmlParser";
import { runReconciliation } from "../engine/xmlReconciliationEngine";
import { XmlFileDropzone } from "./XmlFileDropzone";
import type {
  ExcelInvoiceRecord,
  XmlInvoiceRecord,
} from "../types/reconciliation";

export function ReconciliationPanel() {
  const [excelRows, setExcelRows] = useState<ExcelInvoiceRecord[]>([]);
  const [importedXmls, setImportedXmls] = useState<XmlInvoiceRecord[]>([]);
  const [launchedXmls, setLaunchedXmls] = useState<XmlInvoiceRecord[]>([]);
  const [excelRowsCount, setExcelRowsCount] = useState(0);
  const [importedFilesCount, setImportedFilesCount] = useState(0);
  const [launchedFilesCount, setLaunchedFilesCount] = useState(0);
  const [includeTodayInAnalysis, setIncludeTodayInAnalysis] = useState(false);
  const [excludedDaysInput, setExcludedDaysInput] = useState("");
  const [copiedColumn, setCopiedColumn] = useState<
    "imported" | "launched" | null
  >(null);
  const [analysisResult, setAnalysisResult] = useState(() =>
    runReconciliation([], [], [], false),
  );

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

  const canAnalyze =
    excelRows.length > 0 || importedXmls.length > 0 || launchedXmls.length > 0;
  const canExport =
    analysisResult.totalAnalyzableExcelRows > 0 ||
    analysisResult.totalImportedXmls > 0 ||
    analysisResult.totalLaunchedXmls > 0;

  const handleAnalyze = () => {
    setAnalysisResult(
      runReconciliation(
        excelRows,
        importedXmls,
        launchedXmls,
        includeTodayInAnalysis,
        parseExcludedDays(excludedDaysInput),
      ),
    );
  };

  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();

    const importedRows = analysisResult.missingImportedInvoices.map(
      (invoice) => ({
        Nota: invoice.invoiceNumber,
        CNPJ: invoice.issuerCnpj,
        Data: invoice.issueDate,
      }),
    );

    const launchedRows = analysisResult.missingLaunchedInvoices.map(
      (invoice) => ({
        Nota: invoice.invoiceNumber,
        CNPJ: invoice.issuerCnpj,
        Data: invoice.issueDate,
      }),
    );

    const importedSheet = XLSX.utils.json_to_sheet(importedRows, {
      header: ["Nota", "CNPJ", "Data"],
    });
    const launchedSheet = XLSX.utils.json_to_sheet(launchedRows, {
      header: ["Nota", "CNPJ", "Data"],
    });

    XLSX.utils.book_append_sheet(
      workbook,
      importedSheet,
      "Faltantes Importados",
    );
    XLSX.utils.book_append_sheet(workbook, launchedSheet, "Faltantes Lançados");
    XLSX.writeFile(workbook, "resultado_reconciliacao.xlsx");
  };

  const parseFiles = async (
    files: File[],
    currentXmls: XmlInvoiceRecord[],
    onResolve: (xmls: XmlInvoiceRecord[]) => void,
    onCount: (count: number) => void,
  ) => {
    const parsed = (
      await Promise.all(files.map((file) => parseXmlFile(file)))
    ).filter((value): value is XmlInvoiceRecord => value !== null);

    const deduped = [...currentXmls, ...parsed].filter(
      (xml, index, array) =>
        array.findIndex(
          (candidate) =>
            candidate.fileName === xml.fileName &&
            candidate.invoiceNumber === xml.invoiceNumber &&
            candidate.issuerCnpj === xml.issuerCnpj,
        ) === index,
    );

    console.log("[XML UPLOAD DEBUG] files received:", files);
    console.log("[XML UPLOAD DEBUG] parsed XML array:", parsed);
    console.log("[XML UPLOAD DEBUG] merged XML array:", deduped);
    console.log("[XML UPLOAD DEBUG] merged length:", deduped.length);

    onResolve(deduped);
    onCount(deduped.length);
  };

  const handleExcelFileSelect = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const parsedRows = parseExcelFile(workbook);

    console.log("[EXCEL UPLOAD DEBUG] file:", file.name);
    console.log("[EXCEL UPLOAD DEBUG] workbook sheets:", workbook.SheetNames);
    console.log("[EXCEL UPLOAD DEBUG] parsed rows:", parsedRows);
    console.log("[EXCEL UPLOAD DEBUG] parsed rows length:", parsedRows.length);

    setExcelRows(parsedRows);
    setExcelRowsCount(parsedRows.length);
  };

  const handleCopyInvoiceNumbers = async (
    invoiceNumbers: string[],
    column: "imported" | "launched",
  ) => {
    const textToCopy = invoiceNumbers.join("\n");

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedColumn(column);
      window.setTimeout(
        () =>
          setCopiedColumn((current) => (current === column ? null : current)),
        1200,
      );
    } catch (error) {
      console.error("[COPY NOTE DEBUG] failed to copy invoice numbers:", error);
      setCopiedColumn(column);
      window.setTimeout(
        () =>
          setCopiedColumn((current) => (current === column ? null : current)),
        1200,
      );
    }
  };

  return (
    <div
      style={{ marginInline: "24px", marginBlock: "24px" }}
      className="space-y-6 rounded-2xl border-block border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9333ea]">
            RELATÓRIO XML (EXCEL)
          </p>
          <XmlFileDropzone
            onFileSelect={(files) => {
              const file = files[0];
              if (file) {
                void handleExcelFileSelect(file);
              }
            }}
            compact
            accept=".xlsx,.xls,.csv"
            acceptText="Suportados: .xlsx, .xls, .csv (máx. 10MB)"
          >
            <p className="mt-1 text-left text-sm text-slate-600">
              {excelRowsCount > 0 && `${excelRowsCount} linhas carregadas`}
            </p>
          </XmlFileDropzone>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9333ea]">
            XMLs importados (Cofre SIEG)
          </p>
          <XmlFileDropzone
            backgroundColor="#cee2f4"
            onFileSelect={(files) => {
              void parseFiles(
                files,
                importedXmls,
                setImportedXmls,
                setImportedFilesCount,
              );
            }}
            multiple
            directory
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
            XMLs lançados (G5)
          </p>
          <XmlFileDropzone
            backgroundColor="#cee2f4"
            onFileSelect={(files) => {
              void parseFiles(
                files,
                launchedXmls,
                setLaunchedXmls,
                setLaunchedFilesCount,
              );
            }}
            multiple
            directory
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

      <div className=" bg-blue-50/50 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#1a73e8]">
          Filtros da análise
        </p>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={includeTodayInAnalysis}
            onChange={(event) =>
              setIncludeTodayInAnalysis(event.target.checked)
            }
            className="h-4 w-4 rounded border-slate-300 text-[#1a73e8] focus:ring-[#1a73e8]"
          />
          Incluir o dia atual no relatório Excel
        </label>
        <label
          className="mt-3 block text-sm font-medium text-slate-700"
          title="Atenção: os dias informados serão excluídos em todos os meses. Este filtro não considera o mês."
        >
          Excluir dias do mês
          <input
            type="text"
            value={excludedDaysInput}
            onChange={(event) => setExcludedDaysInput(event.target.value)}
            placeholder="Ex.: 31, 2, 4"
            aria-describedby="excluded-days-warning"
            className="mt-1 block w-full max-w-[220px] rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#1a73e8] focus:ring-2 focus:ring-blue-100"
          />
          <span
            id="excluded-days-warning"
            className="mt-1 block text-[11px] font-normal italic text-amber-700"
          >
            Atenção: todos os meses serão considerados. O filtro exclui o dia
            informado independentemente do mês.
          </span>
        </label>
      </div>

      <div
        style={{ marginBlock: "12px", gap: "24px" }}
        className="my-8 flex justify-start gap-6"
      >
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className="inline-flex h-[52px] w-[180px] items-center justify-center rounded-full border border-transparent bg-[#1a73e8] px-6 text-sm font-semibold tracking-[0.02em] text-white shadow-[0_6px_18px_rgba(26,115,232,0.28)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#185abc] hover:shadow-[0_10px_22px_rgba(26,115,232,0.34)] focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
        >
          <span className="flex items-center gap-2.5">
            <span className="text-base leading-none">▶</span>
            <span>ANALISAR</span>
          </span>
        </button>

        <button
          type="button"
          onClick={handleExportExcel}
          disabled={!canExport}
          className="inline-flex h-[52px] w-[180px] items-center justify-center rounded-full border border-slate-200 bg-white/90 px-6 text-sm font-semibold tracking-[0.02em] text-slate-700 shadow-[0_2px_8px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
        >
          EXPORTAR EXCEL
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Linhas analisáveis
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {analysisResult.totalAnalyzableExcelRows}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
            XMLs importados
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {analysisResult.totalImportedXmls}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
            XMLs lançados
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {analysisResult.totalLaunchedXmls}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex min-w-[2rem] items-center justify-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold uppercase tracking-[0.12em] text-red-700">
              {analysisResult.missingImportedInvoices.length}
            </span>
            <h2 className="text-lg font-semibold text-red-700">
              Faltando nos XMLs importados
            </h2>
          </div>

          <div className="mb-1.5 grid grid-cols-[1.2fr_2fr_1fr_28px] gap-2 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-red-700/80">
            <div className="flex items-center gap-1.5">
              <span>Nota</span>
              <button
                type="button"
                onClick={() =>
                  void handleCopyInvoiceNumbers(
                    analysisResult.missingImportedInvoices.map(
                      (invoice) => invoice.invoiceNumber,
                    ),
                    "imported",
                  )
                }
                className="inline-flex h-6 min-w-[16px] items-center justify-center rounded border border-red-200 bg-red-50 px-1.5 text-[12px] font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100"
                aria-label="Copiar todas as notas faltantes"
                title="Copiar todas as notas"
              >
                {copiedColumn === "imported" ? "Copiado!" : "⧉"}
              </button>
            </div>
            <span>CNPJ</span>
            <span>Data</span>
            <span className="justify-self-end"> </span>
          </div>

          <ul className="max-h-80 space-y-1.5 overflow-y-auto pr-1 text-sm text-red-800">
            {analysisResult.missingImportedInvoices.length === 0 ? (
              <li>Nenhuma nota faltando encontrada.</li>
            ) : (
              analysisResult.missingImportedInvoices.map((invoice, index) => (
                <li
                  key={`${invoice.invoiceNumber}-${invoice.issuerCnpj}-${index}`}
                  className="grid grid-cols-[1.2fr_2fr_1fr_28px] gap-2 rounded-lg bg-white/70 px-3 py-1.5"
                >
                  <span>{invoice.invoiceNumber}</span>
                  <span>{invoice.issuerCnpj}</span>
                  <span>{invoice.issueDate}</span>
                  <span className="justify-self-end" />
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex min-w-[2rem] items-center justify-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold uppercase tracking-[0.12em] text-amber-700">
              {analysisResult.missingLaunchedInvoices.length}
            </span>
            <h2 className="text-lg font-semibold text-amber-700">
              Faltando nos XMLs lançados
            </h2>
          </div>

          <div className="mb-1.5 grid grid-cols-[1.2fr_2fr_1fr_28px] gap-2 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700/80">
            <div className="flex items-center gap-1.5">
              <span>Nota</span>
              <button
                type="button"
                onClick={() =>
                  void handleCopyInvoiceNumbers(
                    analysisResult.missingLaunchedInvoices.map(
                      (invoice) => invoice.invoiceNumber,
                    ),
                    "launched",
                  )
                }
                className="inline-flex h-6 min-w-[16px] items-center justify-center rounded border border-amber-200 bg-amber-50 px-1.5 text-[12px] font-semibold text-amber-700 transition hover:border-amber-300 hover:bg-amber-100"
                aria-label="Copiar todas as notas faltantes"
                title="Copiar todas as notas"
              >
                {copiedColumn === "launched" ? "Copiado!" : "⧉"}
              </button>
            </div>
            <span>CNPJ</span>
            <span>Data</span>
            <span className="justify-self-end"> </span>
          </div>

          <ul className="max-h-80 space-y-1.5 overflow-y-auto pr-1 text-sm text-amber-800">
            {analysisResult.missingLaunchedInvoices.length === 0 ? (
              <li>Nenhuma nota faltando encontrada.</li>
            ) : (
              analysisResult.missingLaunchedInvoices.map((invoice, index) => (
                <li
                  key={`${invoice.invoiceNumber}-${invoice.issuerCnpj}-${index}`}
                  className="grid grid-cols-[1.2fr_2fr_1fr_28px] gap-2 rounded-lg bg-white/70 px-3 py-1.5"
                >
                  <span>{invoice.invoiceNumber}</span>
                  <span>{invoice.issuerCnpj}</span>
                  <span>{invoice.issueDate}</span>
                  <span className="justify-self-end" />
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
