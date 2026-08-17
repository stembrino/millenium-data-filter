/**
 * HealthCheckStatus - Validation results display component
 * Uses Millenium design system for financial ERP software (Purple theme)
 */

import type { HealthCheckStatus as IHealthCheckStatus } from '../types/milenium';
import { MilleniumPanel } from './MilleniumPanel';
import { MilleniumBadge } from './MilleniumBadge';
import { MilleniumButton } from './MilleniumButton';

interface HealthCheckStatusProps {
  status: IHealthCheckStatus;
  onDismiss?: () => void;
}

export function HealthCheckStatus({
  status,
  onDismiss,
}: HealthCheckStatusProps) {
  const result = status.result;

  // Idle state
  if (status.status === 'idle') {
    return (
      <MilleniumPanel variant="card">
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-600">
            Import a file to perform data validation
          </p>
        </div>
      </MilleniumPanel>
    );
  }

  // Loading state
  if (status.isLoading) {
    return (
      <MilleniumPanel variant="card">
        <div className="flex items-center gap-3 py-4">
          <div className="w-4 h-4 rounded-full animate-pulse" style={{ backgroundColor: '#a855f7' }} />
          <p className="text-gray-700">Validando dados...</p>
        </div>
      </MilleniumPanel>
    );
  }

  // Valid state
  if (status.status === 'valid' && result) {
    return (
      <div className="space-y-4">
        <MilleniumPanel
          variant="bordered"
          title="Validação de Dados Concluída"
          subtitle={`${result.validRows} de ${result.totalRows} linhas são válidas`}
        >
          <div className="space-y-4">
            {/* Status summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-xs text-green-700 font-semibold uppercase">
                  Linhas Válidas
                </p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {result.validRows}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-700 font-semibold uppercase">
                  Total de Linhas
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {result.totalRows}
                </p>
              </div>
              <div className="rounded-lg p-4 border" style={{ backgroundColor: '#faf5ff', borderColor: '#e9d5ff' }}>
                <p className="text-xs font-semibold uppercase" style={{ color: '#7e22ce' }}>
                  Status
                </p>
                <p className="text-xl font-bold mt-1" style={{ color: '#581c87' }}>
                  <MilleniumBadge
                    label="Válido"
                    status="success"
                  />
                </p>
              </div>
            </div>

            {/* Warnings if any */}
            {result.warnings.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="font-semibold text-amber-900 text-sm">
                  Avisos ({result.warnings.length})
                </p>
                <ul className="mt-2 space-y-1">
                  {result.warnings.map((warning, idx) => (
                    <li
                      key={idx}
                      className="text-amber-800 text-sm flex items-start gap-2"
                    >
                      <span className="mt-0.5">•</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            {onDismiss && (
              <div className="flex justify-end">
                <MilleniumButton
                  variant="secondary"
                  size="sm"
                  onClick={onDismiss}
                >
                  Fechar
                </MilleniumButton>
              </div>
            )}
          </div>
        </MilleniumPanel>
      </div>
    );
  }

  // Invalid state
  if (status.status === 'invalid' && result) {
    return (
      <div className="space-y-4">
        <MilleniumPanel
          variant="bordered"
          title="Validação Falhou"
          subtitle={`${result.errorCount} erro(s) encontrado(s) - dados não podem ser processados`}
        >
          <div className="space-y-4">
            {/* Status summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-xs text-red-700 font-semibold uppercase">
                  Erros
                </p>
                <p className="text-2xl font-bold text-red-900 mt-1">
                  {result.errorCount}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-700 font-semibold uppercase">
                  Total de Linhas
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {result.totalRows}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-xs text-red-700 font-semibold uppercase">
                  Status
                </p>
                <p className="text-xl font-bold text-red-900 mt-1">
                  <MilleniumBadge label="Falhou" status="error" />
                </p>
              </div>
            </div>

            {/* Errors */}
            {result.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-semibold text-red-900 text-sm">
                  Erros ({result.errors.length})
                </p>
                <ul className="mt-2 space-y-1">
                  {result.errors.map((error, idx) => (
                    <li
                      key={idx}
                      className="text-red-800 text-sm flex items-start gap-2"
                    >
                      <span className="mt-0.5">•</span>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings if any */}
            {result.warnings.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="font-semibold text-amber-900 text-sm">
                  Avisos ({result.warnings.length})
                </p>
                <ul className="mt-2 space-y-1">
                  {result.warnings.map((warning, idx) => (
                    <li
                      key={idx}
                      className="text-amber-800 text-sm flex items-start gap-2"
                    >
                      <span className="mt-0.5">•</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            {onDismiss && (
              <div className="flex justify-end">
                <MilleniumButton
                  variant="secondary"
                  size="sm"
                  onClick={onDismiss}
                >
                  Fechar
                </MilleniumButton>
              </div>
            )}
          </div>
        </MilleniumPanel>
      </div>
    );
  }

  return null;
}
