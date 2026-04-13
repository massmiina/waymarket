import React from 'react';

export default function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col h-full w-full animate-pulse">
      <div className="relative aspect-[4/3] w-full bg-gray-200 shrink-0"></div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="h-5 bg-gray-200 rounded-md w-full mb-2"></div>
        <div className="h-5 bg-gray-200 rounded-md w-2/3 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded-md w-1/3 mb-3"></div>
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}
