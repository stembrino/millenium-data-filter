# Millenium Data Filter & Converter

**Status:** Phase 1 Draft - Health Check Module Implementation  
**Stack:** React + Vite + TypeScript + Tailwind CSS + Vitest  
**Language:** 100% en-US (code, comments, documentation)

---

## 📋 Overview

Millenium Data Filter & Converter is a client-side web application for processing, filtering, and exporting data from Millenium ERP export files (CSV, ODS, XLSX formats).

**Phase 1 Focus:** Implementation of the Health Check validation module with comprehensive schema validation, CPF/CNPJ validation, and error reporting.

---

## ✅ Phase 1: Health Check Module - Completed Features

### 1. Core Schema Validator (`src/engine/schemaValidator.ts`)
Pure TypeScript utilities (no React dependencies) for robust data validation:

- **`validateMilleniumSchema(data)`** - Main orchestrator function
  - Validates required Millenium export columns
  - Detects empty rows
  - Validates CPF/CNPJ format with check digit validation
  - Identifies corrupt or malformed rows
  - Returns structured validation result with errors and warnings

- **`validateCPFCNPJ(value)`** - Document validation
  - Validates Brazilian CPF (11 digits) and CNPJ (14 digits)
  - Supports formatted and unformatted inputs
  - Implements official check digit algorithms
  - Returns validation status and document type

- **`detectEmptyRows(data)`** - Row completeness check
- **`detectInvalidDocuments(data)`** - Document validation across dataset
- **`detectCorruptRows(data)`** - Row structure validation

### 2. React Hook (`src/hooks/useHealthCheck.ts`)
State management and orchestration for health check validation:

- **`useHealthCheck()`** - Custom hook
  - Returns: `{ status, isValid, errorCount, validationResult, runHealthCheck, reset }`
  - Manages validation state (idle, checking, valid, invalid)
  - Async validation with loading states
  - Comprehensive error logging for debugging

### 3. UI Component (`src/components/HealthCheckStatus.tsx`)
Presentation-only React component for displaying validation results:

- **`<HealthCheckStatus />`** - Results display component (< 100 LOC)
  - Color-coded badges for status
  - Error and warning messages
  - Row count summaries
  - Millenium-inspired design

### 4. Comprehensive Unit Tests (`src/tests/schemaValidator.test.ts`)
**30 unit tests** using Vitest - all passing ✅

---

## 🚀 Quick Start

### Installation

```bash
cd ~/_fabio/milenium-data-filter
npm install
```

### Commands

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run test         # Run Vitest (watch mode)
npm run test:ui      # Run Vitest with UI dashboard
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 📁 Project Structure

```
src/
├── components/          # UI Components (< 100 LOC each)
│   └── HealthCheckStatus.tsx      ✅ Phase 1
├── hooks/              # React State Management
│   └── useHealthCheck.ts          ✅ Phase 1
├── engine/             # Pure TypeScript Logic (No React)
│   └── schemaValidator.ts         ✅ Phase 1
├── tests/              # Unit Tests
│   └── schemaValidator.test.ts    ✅ 30 tests passing
├── types/              # TypeScript Definitions
│   └── milenium.ts                ✅ Phase 1
├── App.tsx             # Demo Application
└── main.tsx            # React Entry Point
```

---

## 🧪 Test Coverage

**30 Unit Tests - All Passing ✅**

- CPF/CNPJ validation (9 tests)
- Empty row detection (5 tests)
- Invalid document detection (4 tests)
- Corrupt row detection (1 test)
- Schema check (5 tests)
- End-to-end validation (6 tests)

Run tests:
```bash
npm run test           # Watch mode
npm run test -- --run # Run once
npm run test:ui       # Interactive dashboard
```

---

## 📊 Phase Roadmap

### ✅ Phase 1: Health Check Module (COMPLETED)
- [x] Core schema validator
- [x] CPF/CNPJ validation
- [x] Empty row detection
- [x] Required column validation
- [x] Health Check hook
- [x] HealthCheckStatus component
- [x] 30 comprehensive unit tests
- [x] Tailwind CSS setup
- [x] Demo application

### 📋 Phase 2: File Import & Parsing (TODO)
- [ ] File upload component
- [ ] SheetJS integration
- [ ] Drag-and-drop UI

### 📋 Phase 3: Preset Engine & Preview (TODO)
- [ ] Preset definitions and execution
- [ ] Data grid component
- [ ] Aggregation and grouping

### 📋 Phase 4: Export & File Generation (TODO)
- [ ] CSV/ODS/XLSX export
- [ ] Export UI controls

---

## 🏗️ Architecture

### Clean Code Principles

✅ **Single Responsibility**
- Components: UI only, < 100 LOC
- Hooks: State & orchestration
- Engine: Pure functions, no React

✅ **Type Safety**
- TypeScript strict mode
- Type-only imports
- Predictable data structures

✅ **Testability**
- Core logic isolated in `/engine`
- Pure functions (no side effects)
- 100% unit testable

---

## 💻 Technology Stack

| Layer | Technology | Purpose |
|:---|:---|:---|
| **Framework** | React + Vite | Fast build & modular UI |
| **Language** | TypeScript | Type safety & IDE support |
| **Styling** | Tailwind CSS | Atomic CSS framework |
| **Testing** | Vitest | Fast unit test runner |
| **Data** | SheetJS (xlsx) | Parse/generate spreadsheet files |
| **Design** | Millenium-inspired | Professional desktop app aesthetics |

---

## 🛠️ Build & Deployment

### Development
```bash
npm run dev
```
Starts Vite dev server with hot reloading at `http://localhost:5173`

### Production
```bash
npm run build
```
Creates optimized bundle in `dist/`:
- TypeScript compilation with strict mode
- Vite bundling and tree-shaking
- CSS optimization
- Source maps

### Preview
```bash
npm run preview
```
Locally previews the production build.

---

## 📝 Code Conventions

- **Language:** 100% en-US (code, comments, variables, docs)
- **Components:** PascalCase (e.g., `HealthCheckStatus`)
- **Hooks:** camelCase with `use` prefix (e.g., `useHealthCheck`)
- **Functions:** camelCase (e.g., `validateMilleniumSchema`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `REQUIRED_MILENIUM_COLUMNS`)
- **Files:** One export per file when possible
- **Limit:** Components < 100 LOC, hooks as needed

---

## 🚨 Troubleshooting

### Node/npm version issues
```bash
nvm use 22                # Use Node 22
nvm install 22            # Install if needed
```

### Tests failing
```bash
rm -rf node_modules/.vitest    # Clear cache
npm install                    # Reinstall
npm run test                   # Retry
```

### Build errors
```bash
rm -rf dist/ node_modules/.vite
npm install
npm run build
```

---

## 📚 References

- **Vite:** https://vitejs.dev
- **React:** https://react.dev
- **TypeScript:** https://typescriptlang.org
- **Tailwind CSS:** https://tailwindcss.com
- **Vitest:** https://vitest.dev
- **SheetJS:** https://sheetjs.com

---

**Created:** 2026-08-16  
**Status:** Phase 1 Complete - Ready for Phase 2  
**Location:** `~/_fabio/milenium-data-filter/`
