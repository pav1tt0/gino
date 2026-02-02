import React from 'react';
import { AlertCircle, Download } from 'lucide-react';
import {
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip, ResponsiveContainer
} from 'recharts';
import ChartExportButtons from '../common/ChartExportButtons';
import MissingDataWarning from '../common/MissingDataWarning';
import { exportToCSV, exportToJSON } from '../../utils/exportUtils';

const Compare = ({ materials, selectedMaterials, setSelectedMaterials }) => {
    return (
        <div className="space-y-6">
            {selectedMaterials.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Material Comparison</h2>
                    <p className="text-gray-600">Select materials from the database to compare them here.</p>
                </div>
            ) : selectedMaterials.length === 1 ? (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Material Comparison</h2>
                    <div className="flex items-start space-x-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                        <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-medium">Only 1 material selected.</p>
                            <p className="mt-1">Please select at least 2 materials to enable comparison.</p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border-2 border-blue-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Material Comparison</h2>
                                <p className="text-sm text-gray-600">Comparing {selectedMaterials.length} materials</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => {
                                        const comparedMaterials = materials.filter(m => selectedMaterials.includes(m['Material Name']));
                                        exportToCSV(comparedMaterials, 'materials_comparison');
                                    }}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>CSV</span>
                                </button>
                                <button
                                    onClick={() => {
                                        const comparedMaterials = materials.filter(m => selectedMaterials.includes(m['Material Name']));
                                        exportToJSON(comparedMaterials, 'materials_comparison');
                                    }}
                                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>JSON</span>
                                </button>
                                <button
                                    onClick={() => setSelectedMaterials([])}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Comparison Table */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Detailed Property Comparison</h2>
                            {selectedMaterials.length > 4 && (
                                <div className="flex items-center space-x-2 text-blue-600 animate-pulse">
                                    <span className="text-sm font-medium">Scroll horizontally to view all materials</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            {/* Gradient shadows for scroll indication */}
                            {selectedMaterials.length > 4 && (
                                <>
                                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
                                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
                                </>
                            )}
                            <div className="overflow-x-auto pb-2" style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#10b981 #e5e7eb'
                            }}>
                                <style jsx>{`
                        div::-webkit-scrollbar {
                          height: 14px;
                        }
                        div::-webkit-scrollbar-track {
                          background: #f1f1f1;
                          border-radius: 10px;
                        }
                        div::-webkit-scrollbar-thumb {
                          background: #10b981;
                          border-radius: 10px;
                          border: 2px solid #f1f1f1;
                        }
                        div::-webkit-scrollbar-thumb:hover {
                          background: #059669;
                        }
                      `}</style>
                                <table className={`divide-y divide-gray-200 ${selectedMaterials.length <= 4 ? 'w-full' : 'min-w-max'}`}>
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Property</th>
                                            {selectedMaterials.map(materialName => (
                                                <th key={materialName} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                                                    <div className="flex items-center justify-between">
                                                        <span>{materialName}</span>
                                                        <button
                                                            onClick={() => setSelectedMaterials(prev => prev.filter(name => name !== materialName))}
                                                            className="ml-2 text-red-600 hover:text-red-800 font-bold text-lg"
                                                            title="Remove from comparison"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {[
                                            'Sustainability Score',
                                            'Environmental_Sustainability',
                                            'GHG Emissions (kg CO2e/kg)',
                                            'Water Consumption (L/kg)',
                                            'Energy Use (MJ/kg)',
                                            'Social Sustainability',
                                            'Governance',
                                            'Durability',
                                            'Tensile Strength (MPa)',
                                            'Chemical Resistance',
                                            'Comfort Level'
                                        ].map(property => {
                                            // Calculate the highest Sustainability Score for highlighting
                                            let highestScore = -Infinity;
                                            if (property === 'Sustainability Score') {
                                                selectedMaterials.forEach(materialName => {
                                                    const material = materials.find(m => m['Material Name'] === materialName);
                                                    const score = parseFloat(material?.['Sustainability Score']) || 0;
                                                    if (score > highestScore) {
                                                        highestScore = score;
                                                    }
                                                });
                                            }

                                            return (
                                                <tr key={property}>
                                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 w-48">{property.replace('_', ' ')}</td>
                                                    {selectedMaterials.map(materialName => {
                                                        const material = materials.find(m => m['Material Name'] === materialName);
                                                        const value = material?.[property] || 'N/A';

                                                        // Check if this is the highest Sustainability Score
                                                        const isHighestScore = property === 'Sustainability Score' &&
                                                            parseFloat(material?.['Sustainability Score']) === highestScore &&
                                                            highestScore > 0;

                                                        // Apply fixed width for Comfort Level with wrapping
                                                        const cellClass = property === 'Comfort Level'
                                                            ? 'px-6 py-4 text-sm max-w-xs'
                                                            : 'px-6 py-4 whitespace-nowrap text-sm';

                                                        return (
                                                            <td
                                                                key={materialName}
                                                                className={`${cellClass} ${isHighestScore ? 'bg-green-100 font-bold text-green-800' : 'text-gray-900'}`}
                                                            >
                                                                {value}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Radar Chart Comparison */}
                    <div className="bg-white rounded-xl shadow-lg p-6" id="radar-comparison-chart">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Multi-Dimensional Radar Comparison</h2>
                                <p className="text-sm text-gray-600">Overall material profile comparison</p>
                            </div>
                            <ChartExportButtons
                                chartId="radar-comparison-chart"
                                filename="radar_comparison"
                            />
                        </div>
                        <MissingDataWarning
                            excludedMaterials={materials
                                .filter(material => selectedMaterials.includes(material['Material Name']))
                                .map(material => {
                                    const missingMetrics = [];

                                    // Only check QUANTITATIVE fields (can be N/A)
                                    const sustainability = parseFloat(material['Sustainability Score']) || 0;
                                    const sustainStr = String(material['Sustainability Score'] || '').toUpperCase();
                                    const costStr = String(material['Cost Range ($/kg)'] || '').toUpperCase();

                                    if (sustainability === 0 || sustainStr.includes('N/A')) {
                                        missingMetrics.push('Sustain. Score');
                                    }
                                    if (!costStr.match(/[\d.]+/) || costStr.includes('N/A')) {
                                        missingMetrics.push('Cost');
                                    }

                                    // QUALITATIVE fields (always present): Environmental_Sustainability, Social Sustainability,
                                    // Governance, Durability - no check needed

                                    return { name: material['Material Name'], metrics: missingMetrics };
                                })
                                .filter(item => item.metrics.length > 0)
                                .map(item => ({ name: item.name, reason: item.metrics.join(', ') }))}
                        />
                        <ResponsiveContainer width="100%" height={450}>
                            <RadarChart data={(() => {
                                const comparedMaterials = materials.filter(m => selectedMaterials.includes(m['Material Name']));

                                // Helper function to normalize values to 0-6 scale
                                const normalizeTextValue = (value) => {
                                    if (!value) return 0;
                                    const val = String(value).toLowerCase().trim();

                                    // Check for explicit N/A string
                                    if (val.includes('n/a')) return 0;

                                    // Check if it's a number (0-6 scale)
                                    const num = parseFloat(value);
                                    if (!isNaN(num)) {
                                        // Keep 0-6 scale as is
                                        return Math.max(0, Math.min(num, 6));
                                    }

                                    // Text-based values mapped to 0-6 scale
                                    if (val.includes('veryhigh') || val.includes('very high') || val.includes('excellent')) return 6;
                                    if (val.includes('high')) return 5;
                                    if (val.includes('mediumhigh') || val.includes('medium-high') || val.includes('medium high')) return 4.5;
                                    if (val.includes('medium') || val.includes('moderate')) return 3.5;
                                    if (val.includes('mediumlow') || val.includes('medium-low') || val.includes('medium low')) return 2.5;
                                    if (val.includes('low')) return 2;
                                    if (val.includes('verylow') || val.includes('very low') || val.includes('poor')) return 1;

                                    return 0;
                                };

                                return [
                                    {
                                        metric: 'Sustainability\nScore',
                                        ...Object.fromEntries(comparedMaterials.map(m => [
                                            m['Material Name'],
                                            normalizeTextValue(m['Sustainability Score'])
                                        ]))
                                    },
                                    {
                                        metric: 'Environmental\nSustainability',
                                        ...Object.fromEntries(comparedMaterials.map(m => [
                                            m['Material Name'],
                                            normalizeTextValue(m['Environmental_Sustainability'])
                                        ]))
                                    },
                                    {
                                        metric: 'Social\nSustainability',
                                        ...Object.fromEntries(comparedMaterials.map(m => [
                                            m['Material Name'],
                                            normalizeTextValue(m['Social Sustainability'])
                                        ]))
                                    },
                                    {
                                        metric: 'Governance',
                                        ...Object.fromEntries(comparedMaterials.map(m => [
                                            m['Material Name'],
                                            normalizeTextValue(m['Governance'])
                                        ]))
                                    },
                                    {
                                        metric: 'Durability',
                                        ...Object.fromEntries(comparedMaterials.map(m => [
                                            m['Material Name'],
                                            normalizeTextValue(m['Durability'])
                                        ]))
                                    },
                                    {
                                        metric: 'Cost\n(Affordability)',
                                        ...Object.fromEntries(comparedMaterials.map(m => {
                                            const costStr = String(m['Cost Range ($/kg)'] || '');
                                            // Check for N/A - return 0 (no data)
                                            if (costStr.toUpperCase().includes('N/A')) return [m['Material Name'], 0];
                                            const match = costStr.match(/[\d.]+/);
                                            const cost = match ? parseFloat(match[0]) : 0;
                                            // Invert cost: lower cost = higher score (more affordable) - scale 0-6
                                            return [m['Material Name'], cost > 0 ? Math.max(0, Math.min(6, 7 - (cost / 2))) : 0];
                                        }))
                                    }
                                ];
                            })()}>
                                <PolarGrid stroke="#d1d5db" strokeDasharray="3 3" />
                                <PolarAngleAxis dataKey="metric" tick={{ fill: '#1f2937', fontSize: 11, fontWeight: 500 }} />
                                <PolarRadiusAxis angle={90} domain={[0, 6]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                                {selectedMaterials.map((matName, idx) => (
                                    <Radar
                                        key={matName}
                                        name={matName}
                                        dataKey={matName}
                                        stroke={['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'][idx % 5]}
                                        fill={['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'][idx % 5]}
                                        fillOpacity={0.4}
                                        strokeWidth={2}
                                    />
                                ))}
                                <Legend />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
};

export default Compare;
