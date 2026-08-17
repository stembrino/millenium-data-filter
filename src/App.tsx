/**
 * Millenium Data Filter & Converter
 */

import { HealthCheckStatus } from './components/HealthCheckStatus';
import { FileDropzone } from './components/FileDropzone';
import { PresetFilterButtons } from './components/PresetFilterButtons';
import { ResultsSummary } from './components/ResultsSummary';
import { DataGrid } from './components/DataGrid';
import { MilleniumPanel } from './components/MilleniumPanel';
import { useHealthCheck } from './hooks/useHealthCheck';
import { useFileParser } from './hooks/useFileParser';
import { useFilterPresets } from './hooks/useFilterPresets';
import { useCfopFilter } from './hooks/useCfopFilter';
import './index.css';

function App() {
  const { status, runHealthCheck, reset } = useHealthCheck();
  const fileParser = useFileParser();
  const filterPresets = useFilterPresets(fileParser.data);
  const { cfopFilter, selectSingleCfop, deselectAll } =
    useCfopFilter(fileParser.data || []);

  const handleFileSelect = async (file: File) => {
    const result = await fileParser.parseFile(file);
    if (result.success && result.data) {
      await runHealthCheck(result.data);
      filterPresets.clearPresets();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Millenium Data Filter
          </h1>
          <p className="text-gray-600 text-lg">
            Enviar • Validar • Filtrar • Visualizar
          </p>
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
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Resultados da Validação
                </h3>
                <HealthCheckStatus status={status} onDismiss={reset} />
              </div>
            )}

            {/* Error Messages */}
            {fileParser.error && (
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '6px',
                }}
              >
                <p style={{ fontSize: '14px', color: '#991b1b', margin: 0 }}>
                  {fileParser.error}
                </p>
              </div>
            )}

            {/* Success Message */}
            {fileParser.data && (
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#dcfce7',
                  border: '1px solid #bbf7d0',
                  borderRadius: '6px',
                }}
              >
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#166534',
                    margin: '0 0 4px 0',
                  }}
                >
                  Arquivo carregado com sucesso
                </p>
                <p style={{ fontSize: '12px', color: '#15803d', margin: 0 }}>
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
              {/* Filters Section - Presets + CFOP */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '16px' }}>
                {/* Preset Filters */}
                <div>
                  <PresetFilterButtons
                    activePreset={filterPresets.activePreset}
                    onSelectPreset={filterPresets.selectPreset}
                    onExecute={filterPresets.executeActivePreset}
                    isExecuting={filterPresets.isExecuting}
                  />
                </div>

                {/* CFOP Dropdown Filter */}
                <div
                  style={{
                    backgroundColor: '#faf5ff',
                    padding: '16px',
                    borderRadius: '6px',
                    border: '1px solid #e9d5ff',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <label
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#581c87',
                      marginBottom: '8px',
                    }}
                  >
                    Filtrar por CFOP
                  </label>
                  <select
                    value={cfopFilter.selectedCfops[0] || ''}
                    onChange={(e) => {
                      const newCfop = e.target.value;
                      if (newCfop) {
                        selectSingleCfop(newCfop);
                      } else {
                        deselectAll();
                      }
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #e9d5ff',
                      backgroundColor: 'white',
                      color: '#581c87',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">-- Todos os CFOPs --</option>
                    {(() => {
                      if (!fileParser.data || fileParser.data.length === 0) {
                        console.log('DEBUG: fileParser.data is empty or undefined');
                        return [];
                      }
                      
                      console.log('DEBUG: fileParser.data exists, rows:', fileParser.data.length);
                      
                      const cfops = Array.from(
                        new Set(
                          fileParser.data
                            .map((row) => {
                              const cfopValue = row['Cfop'];
                              if (cfopValue === null || cfopValue === undefined) return null;
                              return String(cfopValue).trim();
                            })
                            .filter((cfop): cfop is string => cfop !== null && cfop !== '')
                        )
                      ).sort();
                      
                      console.log('DEBUG: CFOPs found:', cfops);
                      
                      return cfops.map((cfop) => (
                        <option key={cfop} value={cfop}>
                          {cfop}
                        </option>
                      ));
                    })()}
                  </select>
                  {cfopFilter.selectedCfops.length > 0 && (
                    <div
                      style={{
                        marginTop: '8px',
                        fontSize: '12px',
                        color: '#9333ea',
                        fontWeight: '500',
                      }}
                    >
                      Selecionado: {cfopFilter.selectedCfops[0]}
                    </div>
                  )}
                </div>

                {/* Results Summary */}
                <ResultsSummary
                  {...filterPresets.getSummaryStats()}
                  results={filterPresets.results}
                />
              </div>

              {/* Error from preset execution */}
              {filterPresets.error && (
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: '#fee2e2',
                    border: '1px solid #fecaca',
                    borderRadius: '6px',
                  }}
                >
                  <p style={{ fontSize: '13px', color: '#991b1b', margin: 0 }}>
                    {filterPresets.error}
                  </p>
                </div>
              )}

              {/* CFOP Result if selected */}
              {cfopFilter.selectedCfops.length > 0 && (
                <div
                  style={{
                    backgroundColor: '#faf5ff',
                    border: '1px solid #e9d5ff',
                    padding: '12px',
                    borderRadius: '6px',
                  }}
                >
                  {cfopFilter.cfopSummaries.map((summary) => (
                    <div key={summary.cfop}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr',
                          gap: '12px',
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: 'white',
                            padding: '12px',
                            borderRadius: '4px',
                            border: '1px solid #e9d5ff',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '11px',
                              color: '#9333ea',
                              fontWeight: '600',
                              marginBottom: '4px',
                            }}
                          >
                            Valor Total
                          </div>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: '700',
                              color: '#581c87',
                            }}
                          >
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(summary.totalValue)}
                          </div>
                        </div>

                        <div
                          style={{
                            backgroundColor: 'white',
                            padding: '12px',
                            borderRadius: '4px',
                            border: '1px solid #e9d5ff',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '11px',
                              color: '#9333ea',
                              fontWeight: '600',
                              marginBottom: '4px',
                            }}
                          >
                            Quantidade NFes
                          </div>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: '700',
                              color: '#581c87',
                            }}
                          >
                            {summary.count}
                          </div>
                        </div>

                        <div
                          style={{
                            backgroundColor: 'white',
                            padding: '12px',
                            borderRadius: '4px',
                            border: '1px solid #e9d5ff',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '11px',
                              color: '#9333ea',
                              fontWeight: '600',
                              marginBottom: '4px',
                            }}
                          >
                            Valor Médio
                          </div>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: '700',
                              color: '#581c87',
                            }}
                          >
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(
                              summary.count > 0
                                ? summary.totalValue / summary.count
                                : 0
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Data Grid */}
              {filterPresets.processedData && filterPresets.processedData.length > 0 && (
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

export default App;
