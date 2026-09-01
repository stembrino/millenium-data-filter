/**
 * Millenium Data Filter & Converter
 */

import { useState } from "react";
import { HealthCheckStatus } from "./components/HealthCheckStatus";
import { FileDropzone } from "./components/FileDropzone";
import { CfopFilterButtons } from "./components/CfopFilterButtons";
import { DocumentFilterButtons } from "./components/DocumentFilterButtons";
import { SeriesFilterButtons } from "./components/SeriesFilterButtons";
import { DataGrid } from "./components/DataGrid";
import { MilleniumPanel } from "./components/MilleniumPanel";
import { useHealthCheck } from "./hooks/useHealthCheck";
import { useFileParser } from "./hooks/useFileParser";
import { useFilterPresets } from "./hooks/useFilterPresets";
import { useCfopFilter } from "./hooks/useCfopFilter";
import { useDocumentFilter } from "./hooks/useDocumentFilter";
import { useSeriesFilter } from "./hooks/useSeriesFilter";
import { validateCPFCNPJ } from "./engine/schemaValidator";
import "./index.css";

const toNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.replace(/\./g, "").replace(",", ".").trim();

    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatClipboardNumber = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

function MilleniumDataFilter() {
  const { status, runHealthCheck, reset } = useHealthCheck();
  const fileParser = useFileParser();
  const filterPresets = useFilterPresets(fileParser.data);
  const { cfopFilter, toggleCfop } = useCfopFilter(fileParser.data || []);
  const { documentFilter, toggleDocumentType } = useDocumentFilter(
    fileParser.data || [],
  );
  const { seriesFilter, toggleSerie } = useSeriesFilter(fileParser.data || []);

  const filteredRows =
    fileParser.data?.filter((row) => {
      const selectedCfops = cfopFilter.selectedCfops;
      const selectedDocumentTypes = documentFilter.selectedDocumentTypes;
      const selectedSeries = seriesFilter.selectedSeries;

      const matchesCfop =
        selectedCfops.length === 0 ||
        selectedCfops.includes(String(row["Cfop"] || "").trim());

      const documentValue = row["Cnpj/Cpf Destinatário"];
      const documentValidation = validateCPFCNPJ(
        documentValue === null || documentValue === undefined
          ? ""
          : String(documentValue),
      );

      const matchesDocumentType =
        selectedDocumentTypes.length === 0 ||
        (documentValidation.isValid &&
          documentValidation.documentType !== "unknown" &&
          selectedDocumentTypes.includes(documentValidation.documentType));

      const matchesSeries =
        selectedSeries.length === 0 ||
        selectedSeries.includes(String(row["Série"] || "").trim());

      return matchesCfop && matchesDocumentType && matchesSeries;
    }) || [];

  const filteredTotals = filteredRows.reduce<{
    valor: number;
    baseIcms: number;
    valorIcms: number;
  }>(
    (acc, row) => {
      acc.valor += toNumber(row["Valor"]);
      acc.baseIcms += toNumber(row["Base Icms"]);
      acc.valorIcms += toNumber(row["Valor Icms"]);
      return acc;
    },
    { valor: 0, baseIcms: 0, valorIcms: 0 },
  );

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);

      window.setTimeout(() => {
        setCopiedKey((current) => (current === key ? null : current));
      }, 1200);
    } catch {
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((current) => (current === key ? null : current));
      }, 1200);
    }
  };

  const handleFileSelect = async (file: File) => {
    const result = await fileParser.parseFile(file);
    if (result.success && result.data) {
      await runHealthCheck(result.data);
      filterPresets.clearPresets();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 px-3 py-4">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className="mb-8"
          style={{ paddingLeft: "6px", marginLeft: "24px" }}
        >
          <h1 className=" text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Millenium Filter
          </h1>
        </div>

        {/* File Import with Validation */}
        <MilleniumPanel variant="default">
          <div className="space-y-6">
            {/* Upload Area */}
            <div>
              <FileDropzone
                onFileSelect={handleFileSelect}
                isLoading={fileParser.isLoading}
              />
            </div>

            {/* Validation Status */}
            {fileParser.data && (
              <HealthCheckStatus status={status} onDismiss={reset} />
            )}

            {/* Error Messages */}
            {fileParser.error && (
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#fee2e2",
                  border: "1px solid #fecaca",
                  borderRadius: "6px",
                }}
              >
                <p style={{ fontSize: "14px", color: "#991b1b", margin: 0 }}>
                  {fileParser.error}
                </p>
              </div>
            )}

            {/* Success Message */}
            {fileParser.data && (
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#dcfce7",
                  border: "1px solid #bbf7d0",
                  borderRadius: "6px",
                }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#166534",
                    margin: "0 0 4px 0",
                  }}
                >
                  Arquivo carregado com sucesso
                </p>
                <p style={{ fontSize: "12px", color: "#15803d", margin: 0 }}>
                  {fileParser.fileName} • {fileParser.rowCount} linhas
                </p>
              </div>
            )}
          </div>
        </MilleniumPanel>

        {/* Data Processing & Preview */}
        {fileParser.data && fileParser.data.length > 0 && (
          <MilleniumPanel variant="default">
            <div className="space-y-6">
              {/* Filters Section - Accumulative filters */}
              <div className="space-y-4">
                <CfopFilterButtons
                  data={fileParser.data}
                  selectedCfops={cfopFilter.selectedCfops}
                  onToggleCfop={toggleCfop}
                />

                <DocumentFilterButtons
                  data={fileParser.data}
                  selectedDocumentTypes={documentFilter.selectedDocumentTypes}
                  onToggleDocumentType={toggleDocumentType}
                />

                <SeriesFilterButtons
                  data={fileParser.data}
                  selectedSeries={seriesFilter.selectedSeries}
                  onToggleSerie={toggleSerie}
                />
              </div>

              {/* Error from preset execution */}
              {filterPresets.error && (
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#fee2e2",
                    border: "1px solid #fecaca",
                    borderRadius: "6px",
                  }}
                >
                  <p style={{ fontSize: "13px", color: "#991b1b", margin: 0 }}>
                    {filterPresets.error}
                  </p>
                </div>
              )}

              {(cfopFilter.selectedCfops.length > 0 ||
                documentFilter.selectedDocumentTypes.length > 0 ||
                seriesFilter.selectedSeries.length > 0) && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "12px",
                    padding: "16px",
                    backgroundColor: "#faf5ff",
                    borderRadius: "8px",
                    border: "1px solid #e9d5ff",
                  }}
                >
                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      border: "1px solid #e9d5ff",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "4px",
                      }}
                    >
                      Valor Total
                    </div>
                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "#9333ea",
                      }}
                    >
                      {formatCurrency(filteredTotals.valor)}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          "valor",
                          formatClipboardNumber(filteredTotals.valor),
                        )
                      }
                      style={{
                        marginTop: "8px",
                        fontSize: "11px",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        border: "1px solid #c084fc",
                        backgroundColor:
                          copiedKey === "valor" ? "#dcfce7" : "#f5f3ff",
                        color: copiedKey === "valor" ? "#166534" : "#6b21a8",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {copiedKey === "valor" ? "Copiado!" : "Copiar"}
                    </button>
                  </div>

                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      border: "1px solid #e9d5ff",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "4px",
                      }}
                    >
                      Base Icms
                    </div>
                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "#9333ea",
                      }}
                    >
                      {formatCurrency(filteredTotals.baseIcms)}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          "baseIcms",
                          formatClipboardNumber(filteredTotals.baseIcms),
                        )
                      }
                      style={{
                        marginTop: "8px",
                        fontSize: "11px",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        border: "1px solid #c084fc",
                        backgroundColor:
                          copiedKey === "baseIcms" ? "#dcfce7" : "#f5f3ff",
                        color: copiedKey === "baseIcms" ? "#166534" : "#6b21a8",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {copiedKey === "baseIcms" ? "Copiado!" : "Copiar"}
                    </button>
                  </div>

                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      border: "1px solid #e9d5ff",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "4px",
                      }}
                    >
                      Valor Icms
                    </div>
                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "#9333ea",
                      }}
                    >
                      {formatCurrency(filteredTotals.valorIcms)}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          "valorIcms",
                          formatClipboardNumber(filteredTotals.valorIcms),
                        )
                      }
                      style={{
                        marginTop: "8px",
                        fontSize: "11px",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        border: "1px solid #c084fc",
                        backgroundColor:
                          copiedKey === "valorIcms" ? "#dcfce7" : "#f5f3ff",
                        color:
                          copiedKey === "valorIcms" ? "#166534" : "#6b21a8",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {copiedKey === "valorIcms" ? "Copiado!" : "Copiar"}
                    </button>
                  </div>
                </div>
              )}

              {/* Data Grid */}
              {filterPresets.processedData &&
                filterPresets.processedData.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Visualização de Dados
                    </h3>
                    <DataGrid data={filterPresets.processedData} maxRows={10} />
                  </div>
                )}
            </div>
          </MilleniumPanel>
        )}
      </div>
    </div>
  );
}

export default MilleniumDataFilter;
