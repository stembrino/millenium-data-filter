/**
 * Millenium result panel wrapper component
 * Provides consistent styling and structure for result displays
 * Clean code component - reuses styling across different result types
 */

import React from 'react';

interface MilleniumResultWrapperProps {
  title: string;
  cfop: string;
  children: React.ReactNode;
}

export function MilleniumResultWrapper({
  title,
  cfop,
  children,
}: MilleniumResultWrapperProps) {
  return (
    <div
      style={{
        backgroundColor: '#faf5ff',
        borderLeft: '4px solid #9333ea',
        padding: '16px',
        borderRadius: '6px',
        marginBottom: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <h3
          style={{
            margin: '0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#581c87',
          }}
        >
          {title}
        </h3>
        <span
          style={{
            backgroundColor: '#9333ea',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '600',
          }}
        >
          CFOP: {cfop}
        </span>
      </div>

      <div
        style={{
          borderTop: '1px solid #e9d5ff',
          paddingTop: '12px',
        }}
      >
        {children}
      </div>
    </div>
  );
}
