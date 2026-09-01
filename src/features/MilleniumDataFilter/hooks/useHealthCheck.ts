/**
 * useHealthCheck - React hook for managing health check state and orchestration
 * Manages validation state, results, and loading
 */

import { useState, useCallback } from 'react';
import type {
  RowData,
  HealthCheckStatus,
  ValidationResult,
} from '../types/milenium';
import { validateMileniumSchema } from '../engine/schemaValidator';

/**
 * Return type for useHealthCheck hook
 */
export interface UseHealthCheckReturn {
  status: HealthCheckStatus;
  isValid: boolean;
  errorCount: number;
  validationResult: ValidationResult | null;
  runHealthCheck: (data: RowData[]) => Promise<void>;
  reset: () => void;
}

/**
 * React hook to manage health check validation
 * Encapsulates all validation state and business logic
 *
 * @returns Hook return value with status, results, and control functions
 *
 * @example
 * const { status, isValid, runHealthCheck } = useHealthCheck();
 *
 * useEffect(() => {
 *   if (fileData) {
 *     runHealthCheck(fileData);
 *   }
 * }, [fileData, runHealthCheck]);
 */
export function useHealthCheck(): UseHealthCheckReturn {
  const [status, setStatus] = useState<HealthCheckStatus>({
    status: 'idle',
    result: null,
    isLoading: false,
  });

  /**
   * Run health check validation on provided data
   * This is an async function for future extensibility (API calls, etc.)
   */
  const runHealthCheck = useCallback(async (data: RowData[]) => {
    try {
      setStatus((prev) => ({
        ...prev,
        status: 'checking',
        isLoading: true,
      }));

      // Simulate small delay to show loading state in UI
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Run pure validator function (pure TypeScript, no React state)
      const validationResult = validateMileniumSchema(data);

      // Update state with results
      setStatus({
        status: validationResult.isValid ? 'valid' : 'invalid',
        result: validationResult,
        isLoading: false,
      });

      // Log results for debugging
      console.log('[HealthCheck] Validation completed:', {
        isValid: validationResult.isValid,
        totalRows: validationResult.totalRows,
        validRows: validationResult.validRows,
        errorCount: validationResult.errorCount,
        errors: validationResult.errors,
        warnings: validationResult.warnings,
      });
    } catch (error) {
      console.error('[HealthCheck] Validation error:', error);

      setStatus({
        status: 'invalid',
        result: {
          isValid: false,
          totalRows: 0,
          validRows: 0,
          errorCount: 1,
          missingColumns: [],
          errors: [
            `Unexpected error during validation: ${error instanceof Error ? error.message : 'Unknown error'}`,
          ],
          warnings: [],
        },
        isLoading: false,
      });
    }
  }, []);

  /**
   * Reset health check state to idle
   */
  const reset = useCallback(() => {
    setStatus({
      status: 'idle',
      result: null,
      isLoading: false,
    });
  }, []);

  return {
    status,
    isValid: status.result?.isValid ?? false,
    errorCount: status.result?.errorCount ?? 0,
    validationResult: status.result,
    runHealthCheck,
    reset,
  };
}
