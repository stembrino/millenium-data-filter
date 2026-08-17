/**
 * PresetFilterButtons - UI Component
 * One-click hardcoded preset buttons
 */

import { FILTER_PRESETS } from '../engine/filterPresets';

interface PresetFilterButtonsProps {
  activePreset: string | null;
  onSelectPreset: (presetId: string) => void;
  onExecute: () => void;
  isExecuting: boolean;
}

export function PresetFilterButtons({
  activePreset,
  onSelectPreset,
  onExecute,
  isExecuting,
}: PresetFilterButtonsProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '16px',
        backgroundColor: '#faf5ff',
        borderRadius: '8px',
        border: '1px solid #e9d5ff',
      }}
    >
      <div>
        <h4
          style={{
            marginTop: 0,
            marginBottom: '12px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#581c87',
          }}
        >
          Filtros Predefinidos
        </h4>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {FILTER_PRESETS.map((preset) => {
          const isActive = activePreset === preset.id;

          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              title={preset.description}
              style={{
                padding: '10px 12px',
                backgroundColor: isActive ? '#9333ea' : '#fff',
                color: isActive ? '#fff' : '#333',
                border: `1.5px solid ${isActive ? '#9333ea' : '#d8b4fe'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#f3e8ff';
                  e.currentTarget.style.borderColor = '#c084fc';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.borderColor = '#d8b4fe';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>
                  {isActive ? '✓' : '○'}
                </span>
                <div>
                  <div style={{ fontWeight: '600' }}>{preset.label}</div>
                  <div
                    style={{
                      fontSize: '11px',
                      opacity: isActive ? '0.9' : '0.6',
                    }}
                  >
                    {preset.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={onExecute}
        disabled={isExecuting || !activePreset}
        style={{
          padding: '12px 16px',
          backgroundColor:
            isExecuting || !activePreset ? '#ccc' : '#9333ea',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: isExecuting || !activePreset ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          marginTop: '8px',
          transition: 'all 0.2s ease',
          opacity: isExecuting || !activePreset ? '0.6' : '1',
        }}
        onMouseEnter={(e) => {
          if (!isExecuting && activePreset) {
            e.currentTarget.style.backgroundColor = '#7e22ce';
          }
        }}
        onMouseLeave={(e) => {
          if (!isExecuting && activePreset) {
            e.currentTarget.style.backgroundColor = '#9333ea';
          }
        }}
      >
        {isExecuting ? 'Processando...' : 'Aplicar Filtro'}
      </button>
    </div>
  );
}
