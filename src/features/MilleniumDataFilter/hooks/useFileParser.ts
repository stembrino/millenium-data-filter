/**
 * useFileParser - React hook for file parsing
 * Manages file upload and parsing with SheetJS
 */

import { useState } from 'react';
import {
  parseFileToJSON,
  isValidFileFormat,
  type ParseResult,
} from '../engine/fileParser';
import type { RowData } from '../types/milenium';

interface FileParseState {
  isLoading: boolean;
  data: RowData[] | null;
  error: string | null;
  fileName: string | null;
  rowCount: number | null;
}

export function useFileParser() {
  const [state, setState] = useState<FileParseState>({
    isLoading: false,
    data: null,
    error: null,
    fileName: null,
    rowCount: null,
  });

  const parseFile = async (file: File): Promise<ParseResult> => {
    setState({
      isLoading: true,
      data: null,
      error: null,
      fileName: null,
      rowCount: null,
    });

    // Validate file format
    if (!isValidFileFormat(file.name)) {
      const error = 'Invalid file format. Supported: .xlsx, .csv, .ods';
      setState({
        isLoading: false,
        data: null,
        error,
        fileName: null,
        rowCount: null,
      });
      return { success: false, error };
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      const error = 'File is too large. Maximum size: 10MB';
      setState({
        isLoading: false,
        data: null,
        error,
        fileName: null,
        rowCount: null,
      });
      return { success: false, error };
    }

    try {
      const buffer = await file.arrayBuffer();
      const result = parseFileToJSON(buffer, file.name);

      if (result.success && result.data) {
        console.log('✅ File Parsed Successfully', {
          fileName: result.fileName,
          rowCount: result.rowCount,
          rows: result.data,
        });

        setState({
          isLoading: false,
          data: result.data,
          error: null,
          fileName: result.fileName || null,
          rowCount: result.rowCount || null,
        });
      } else {
        const errorMsg = result.error || 'Unknown error';
        console.error('❌ File Parse Error:', errorMsg);

        setState({
          isLoading: false,
          data: null,
          error: errorMsg,
          fileName: null,
          rowCount: null,
        });
      }

      return result;
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'Unknown error';
      setState({
        isLoading: false,
        data: null,
        error: errorMsg,
        fileName: null,
        rowCount: null,
      });
      return {
        success: false,
        error: errorMsg,
      };
    }
  };

  const reset = () => {
    setState({
      isLoading: false,
      data: null,
      error: null,
      fileName: null,
      rowCount: null,
    });
  };

  return {
    ...state,
    parseFile,
    reset,
  };
}
