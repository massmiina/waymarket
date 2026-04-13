import React from 'react';

export const TowerIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* The main tapering body of the Vainakh tower */}
    <path d="M8 22L9.5 7H14.5L16 22H8Z" fill="currentColor" fillOpacity="0.1" />
    
    {/* The stepped pyramidal roof (Vakh) */}
    <path d="M9.5 7L12 3L14.5 7" />
    <path d="M10.5 5H13.5" />
    
    {/* Defensive windows/loopholes */}
    <rect x="11.5" y="10" width="1" height="2" fill="currentColor" stroke="none" />
    <rect x="11.5" y="15" width="1" height="2" fill="currentColor" stroke="none" />
    
    {/* Base line */}
    <path d="M7 22H17" />
  </svg>
);
