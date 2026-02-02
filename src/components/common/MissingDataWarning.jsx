import React from 'react';

const MissingDataWarning = ({ excludedMaterials }) => {
    if (!excludedMaterials || excludedMaterials.length === 0) return null;

    return (
        <div className="mb-2 p-2 bg-yellow-50 border-l border-yellow-400 rounded text-xs inline-block max-w-md">
            <div className="flex items-start gap-1.5">
                <svg className="h-3 w-3 text-yellow-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="min-w-0">
                    <p className="text-yellow-700 font-medium leading-tight">
                        {excludedMaterials.length} material{excludedMaterials.length > 1 ? 's' : ''} with missing data (N/A):
                    </p>
                    <div className="mt-0.5 text-yellow-600 leading-snug">
                        {excludedMaterials.map((material, idx) => (
                            <div key={idx} className="truncate">
                                {material.name}{material.reason ? ` (${material.reason})` : ''}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MissingDataWarning;
