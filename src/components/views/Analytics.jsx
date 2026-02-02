import React, { useState, useEffect } from 'react';
import { Search, PieChart } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    ScatterChart, Scatter, PieChart as RechartsPieChart, Pie, Cell,
    ComposedChart, Line, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import ChartExportButtons from '../common/ChartExportButtons';
import MissingDataWarning from '../common/MissingDataWarning';
import CustomTooltip from '../common/CustomTooltip';

const Analytics = ({ materials, selectedMaterials, setSelectedMaterials }) => {
    const [analyticsSearchQuery, setAnalyticsSearchQuery] = useState('');
    const [selectedAnalyticsMaterials, setSelectedAnalyticsMaterials] = useState([]);
    const [singleRadarMaterial, setSingleRadarMaterial] = useState('');


    useEffect(() => {
        if (selectedAnalyticsMaterials.length === 0) {
            setSingleRadarMaterial('');
            return;
        }
        if (singleRadarMaterial && !selectedAnalyticsMaterials.includes(singleRadarMaterial)) {
            setSingleRadarMaterial('');
        }
    }, [selectedAnalyticsMaterials, singleRadarMaterial]);

    return (
        <div className="space-y-6">
            {materials.length === 0 ? (
                <div className="text-center py-8">
                    <PieChart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Upload your materials database to view LCA analytics.</p>
                </div>
            ) : (
                <>
                    {/* Material Selection for Analytics */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Select Materials to Analyze</h2>

                        {/* Search Bar */}
                        <div className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search materials..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    value={analyticsSearchQuery}
                                    onChange={(e) => setAnalyticsSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Materials Grid with Enhanced Scrollbar */}
                        <div
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-60 overflow-y-auto pr-2"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#10b981 #e5e7eb'
                            }}
                        >
                            <style jsx>{`
                      div::-webkit-scrollbar {
                        width: 12px;
                      }
                      div::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 10px;
                      }
                      div::-webkit-scrollbar-thumb {
                        background: #10b981;
                        border-radius: 10px;
                      }
                      div::-webkit-scrollbar-thumb:hover {
                        background: #059669;
                      }
                    `}</style>
                            {materials
                                .filter(material =>
                                    !analyticsSearchQuery ||
                                    (material['Material Name'] || '').toLowerCase().includes(analyticsSearchQuery.toLowerCase()) ||
                                    (material.Category || '').toLowerCase().includes(analyticsSearchQuery.toLowerCase())
                                )
                                .sort((a, b) => {
                                    const nameA = (a['Material Name'] || '').toLowerCase();
                                    const nameB = (b['Material Name'] || '').toLowerCase();
                                    return nameA.localeCompare(nameB);
                                })
                                .map((material, index) => (
                                    <label key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={selectedAnalyticsMaterials.includes(material['Material Name'])}
                                            onChange={(e) => {
                                                const materialName = material['Material Name'];
                                                if (e.target.checked) {
                                                    setSelectedAnalyticsMaterials(prev => [...prev, materialName]);
                                                } else {
                                                    setSelectedAnalyticsMaterials(prev => prev.filter(name => name !== materialName));
                                                }
                                            }}
                                            className="text-green-600 w-4 h-4"
                                        />
                                        <span className="text-xs text-gray-700 flex-1">{material['Material Name']}</span>
                                    </label>
                                ))}
                        </div>

                        {/* Footer with counters and buttons */}
                        <div className="mt-4 flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                                {selectedAnalyticsMaterials.length} materials selected
                                {analyticsSearchQuery && (
                                    <span className="ml-2 text-green-600">
                                        ({materials.filter(m =>
                                            (m['Material Name'] || '').toLowerCase().includes(analyticsSearchQuery.toLowerCase()) ||
                                            (m.Category || '').toLowerCase().includes(analyticsSearchQuery.toLowerCase())
                                        ).length} found)
                                    </span>
                                )}
                            </p>
                            <div className="space-x-2">
                                <button
                                    onClick={() => setSelectedAnalyticsMaterials(selectedMaterials)}
                                    disabled={selectedMaterials.length === 0}
                                    className={`px-3 py-1 rounded text-xs transition-colors ${selectedMaterials.length === 0
                                        ? 'bg-blue-300 text-white cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    Load Compare ({selectedMaterials.length})
                                </button>
                                <button
                                    onClick={() => setSelectedAnalyticsMaterials(materials.map(m => m['Material Name']))}
                                    className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                                >
                                    Select All
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedAnalyticsMaterials([]);
                                        setAnalyticsSearchQuery('');
                                    }}
                                    className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition-colors"
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>
                    </div>

                    {selectedAnalyticsMaterials.length === 0 ? (
                        <div className="text-center py-8">
                            <PieChart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">Select materials above to view comparative analytics.</p>
                        </div>
                    ) : (
                        <>
                            {/* Category Distribution Pie Chart */}
                            <div className="bg-white rounded-xl shadow-lg p-6" id="category-distribution-chart">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Materials Distribution by Category
                                    </h2>
                                    <ChartExportButtons
                                        chartId="category-distribution-chart"
                                        filename="category_distribution"
                                    />
                                </div>
                                <ResponsiveContainer width="100%" height={400}>
                                    <RechartsPieChart>
                                        <Pie
                                            data={(() => {
                                                const categoryCount = {};
                                                materials
                                                    .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                                                    .forEach(material => {
                                                        const category = material.Category || 'Unknown';
                                                        categoryCount[category] = (categoryCount[category] || 0) + 1;
                                                    });

                                                const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

                                                return Object.entries(categoryCount).map(([category, count], index) => ({
                                                    name: category,
                                                    value: count,
                                                    fill: colors[index % colors.length]
                                                }));
                                            })()}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={true}
                                            label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                                            outerRadius={120}
                                            dataKey="value"
                                        >
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Environmental Impact Comparison */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* GHG Emissions */}
                                <div className="bg-white rounded-xl shadow-lg p-6" id="ghg-emissions-chart">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-xl font-bold text-gray-900">GHG Emissions Comparison</h2>
                                        <ChartExportButtons
                                            chartId="ghg-emissions-chart"
                                            filename="ghg_emissions_comparison"
                                        />
                                    </div>
                                    <MissingDataWarning
                                        excludedMaterials={materials
                                            .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                                            .filter(material => {
                                                const ghgStr = String(material['GHG Emissions (kg CO2e/kg)'] || '').toUpperCase();
                                                // 0 is a valid value (zero emissions), only N/A or missing data is invalid
                                                return ghgStr.includes('N/A') || !ghgStr.match(/[\d.]+/);
                                            })
                                            .map(material => ({ name: material['Material Name'], reason: 'no GHG data' }))}
                                    />
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={materials
                                            .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                                            .map(material => ({
                                                name: (material['Material Name'] || '').length > 8 ?
                                                    (material['Material Name'] || '').substring(0, 8) + '...' :
                                                    (material['Material Name'] || ''),
                                                fullName: material['Material Name'] || '',
                                                ghg: (() => {
                                                    const ghgStr = String(material['GHG Emissions (kg CO2e/kg)'] || '').toUpperCase();
                                                    // Check for N/A - return null to exclude from chart
                                                    if (ghgStr.includes('N/A') || !ghgStr.match(/[\d.]+/)) return null;
                                                    const match = ghgStr.match(/[\d.]+/);
                                                    return match ? parseFloat(match[0]) : null;
                                                })()
                                            }))
                                            .filter(item => item.ghg !== null) // Include 0, exclude only null (N/A)
                                            .sort((a, b) => a.ghg - b.ghg)}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} fontSize={10} />
                                            <YAxis />
                                            <Tooltip content={<CustomTooltip unit="kg CO2e/kg" />} />
                                            <Bar dataKey="ghg" fill="#ef4444" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Water Consumption */}
                                <div className="bg-white rounded-xl shadow-lg p-6" id="water-consumption-chart">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-xl font-bold text-gray-900">Water Consumption Comparison</h2>
                                        <ChartExportButtons
                                            chartId="water-consumption-chart"
                                            filename="water_consumption_comparison"
                                        />
                                    </div>
                                    <MissingDataWarning
                                        excludedMaterials={materials
                                            .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                                            .filter(material => {
                                                const waterStr = String(material['Water Consumption (L/kg)'] || '').toUpperCase();
                                                // 0 is a valid value (zero water consumption), only N/A or missing data is invalid
                                                return waterStr.includes('N/A') || !waterStr.match(/[\d.]+/);
                                            })
                                            .map(material => ({ name: material['Material Name'], reason: 'no water data' }))}
                                    />
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={materials
                                            .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                                            .map(material => ({
                                                name: (material['Material Name'] || '').length > 8 ?
                                                    (material['Material Name'] || '').substring(0, 8) + '...' :
                                                    (material['Material Name'] || ''),
                                                fullName: material['Material Name'] || '',
                                                water: (() => {
                                                    const waterStr = String(material['Water Consumption (L/kg)'] || '').toUpperCase();
                                                    // Check for N/A - return null to exclude from chart
                                                    if (waterStr.includes('N/A') || !waterStr.match(/[\d.]+/)) return null;
                                                    const match = waterStr.match(/[\d.]+/);
                                                    return match ? parseFloat(match[0]) : null;
                                                })()
                                            }))
                                            .filter(item => item.water !== null) // Include 0, exclude only null (N/A)
                                            .sort((a, b) => a.water - b.water)}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} fontSize={10} />
                                            <YAxis />
                                            <Tooltip content={<CustomTooltip unit="L/kg" />} />
                                            <Bar dataKey="water" fill="#06b6d4" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Energy Consumption */}
                                <div className="bg-white rounded-xl shadow-lg p-6" id="energy-consumption-chart">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-xl font-bold text-gray-900">Energy Consumption Comparison</h2>
                                        <ChartExportButtons
                                            chartId="energy-consumption-chart"
                                            filename="energy_consumption_comparison"
                                        />
                                    </div>
                                    <MissingDataWarning
                                        excludedMaterials={materials
                                            .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                                            .filter(material => {
                                                const energyStr = String(material['Energy Use (MJ/kg)'] || '').toUpperCase();
                                                // 0 is a valid value (zero energy consumption), only N/A or missing data is invalid
                                                return energyStr.includes('N/A') || !energyStr.match(/[\d.]+/);
                                            })
                                            .map(material => ({ name: material['Material Name'], reason: 'no energy data' }))}
                                    />
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={materials
                                            .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                                            .map(material => ({
                                                name: (material['Material Name'] || '').length > 8 ?
                                                    (material['Material Name'] || '').substring(0, 8) + '...' :
                                                    (material['Material Name'] || ''),
                                                fullName: material['Material Name'] || '',
                                                energy: (() => {
                                                    const energyStr = String(material['Energy Use (MJ/kg)'] || '').toUpperCase();
                                                    // Check for N/A - return null to exclude from chart
                                                    if (energyStr.includes('N/A') || !energyStr.match(/[\d.]+/)) return null;
                                                    const match = energyStr.match(/[\d.]+/);
                                                    return match ? parseFloat(match[0]) : null;
                                                })()
                                            }))
                                            .filter(item => item.energy !== null) // Include 0, exclude only null (N/A)
                                            .sort((a, b) => a.energy - b.energy)}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} fontSize={10} />
                                            <YAxis />
                                            <Tooltip content={<CustomTooltip unit="MJ/kg" />} />
                                            <Bar dataKey="energy" fill="#f59e0b" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Fossil Fuel Consumption */}
                                <div className="bg-white rounded-xl shadow-lg p-6" id="fuel-consumption-chart">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Fossil Fuel Consumption Comparison</h2>
                                            <p className="text-sm text-gray-600">Fuel consumption levels (0=N/A, 1=Very Low, 6=Very High)</p>
                                        </div>
                                        <ChartExportButtons
                                            chartId="fuel-consumption-chart"
                                            filename="fuel_consumption_comparison"
                                        />
                                    </div>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={materials
                                            .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                                            .map(material => ({
                                                name: (material['Material Name'] || '').length > 8 ?
                                                    (material['Material Name'] || '').substring(0, 8) + '...' :
                                                    (material['Material Name'] || ''),
                                                fullName: material['Material Name'] || '',
                                                fuel: (() => {
                                                    const fuelStr = String(material['Fuel Consumption (MJ/kg)'] || '').toLowerCase().trim();
                                                    const num = parseFloat(fuelStr);
                                                    if (!isNaN(num)) {
                                                        return Math.max(1, Math.min(num, 6));
                                                    }
                                                    if (fuelStr.includes('veryhigh') || fuelStr.includes('very high')) return 6;
                                                    if (fuelStr.includes('high')) return 5;
                                                    if (fuelStr.includes('mediumhigh') || fuelStr.includes('medium-high') || fuelStr.includes('medium high')) return 4.5;
                                                    if (fuelStr.includes('medium') || fuelStr.includes('moderate')) return 3.5;
                                                    if (fuelStr.includes('mediumlow') || fuelStr.includes('medium-low') || fuelStr.includes('medium low')) return 2.5;
                                                    if (fuelStr.includes('low')) return 2;
                                                    if (fuelStr.includes('verylow') || fuelStr.includes('very low')) return 1;
                                                    return 0;
                                                })()
                                            }))
                                            .filter(item => item.fuel > 0)
                                            .sort((a, b) => a.fuel - b.fuel)}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} fontSize={10} />
                                            <YAxis domain={[0, 6]} />
                                            <Tooltip content={<CustomTooltip unit="/6" />} />
                                            <Bar dataKey="fuel" fill="#8b5cf6" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Sustainability Score Evaluation */}
                            <div className="bg-white rounded-xl shadow-lg p-6" id="sustainability-evaluation-chart">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Sustainability Score Evaluation
                                        </h2>
                                        <p className="text-sm text-gray-600">Sustainability scores of selected materials</p>
                                    </div>
                                    <ChartExportButtons
                                        chartId="sustainability-evaluation-chart"
                                        filename="sustainability_score_evaluation"
                                    />
                                </div>
                                <MissingDataWarning
                                    excludedMaterials={materials
                                        .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                                        .filter(material => {
                                            const score = parseFloat(material['Sustainability Score']) || 0;
                                            const scoreStr = String(material['Sustainability Score'] || '').toUpperCase();
                                            return score === 0 || scoreStr.includes('N/A');
                                        })
                                        .map(material => ({ name: material['Material Name'], reason: 'no sustainability score' }))}
                                />
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={(() => {
                                        const selectedMats = materials.filter(m => selectedAnalyticsMaterials.includes(m['Material Name']));

                                        return selectedMats.map(material => {
                                            const score = parseFloat(material['Sustainability Score']) || 0;
                                            let color;
                                            if (score >= 8) color = '#10b981';
                                            else if (score >= 6) color = '#84cc16';
                                            else if (score >= 4) color = '#f59e0b';
                                            else if (score >= 2) color = '#f97316';
                                            else color = '#ef4444';

                                            return {
                                                name: material['Material Name'],
                                                fullName: material['Material Name'],
                                                score: score,
                                                fill: color
                                            };
                                        }).sort((a, b) => b.score - a.score);
                                    })()}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="name"
                                            angle={-45}
                                            textAnchor="end"
                                            height={120}
                                            interval={0}
                                            tick={{ fontSize: 11 }}
                                        />
                                        <YAxis
                                            label={{ value: 'Sustainability Score', angle: -90, position: 'insideLeft', fontSize: 12 }}
                                            domain={[0, 10]}
                                        />
                                        <Tooltip content={<CustomTooltip unit="" />} />
                                        <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                                            {(() => {
                                                const selectedMats = materials.filter(m => selectedAnalyticsMaterials.includes(m['Material Name']));
                                                return selectedMats.map((material, index) => {
                                                    const score = parseFloat(material['Sustainability Score']) || 0;
                                                    let color;
                                                    if (score >= 8) color = '#10b981';
                                                    else if (score >= 6) color = '#84cc16';
                                                    else if (score >= 4) color = '#f59e0b';
                                                    else if (score >= 2) color = '#f97316';
                                                    else color = '#ef4444';
                                                    return <Cell key={`cell-${index}`} fill={color} />;
                                                });
                                            })()}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                                    <p className="text-sm text-gray-700">
                                        <strong>Interpretation:</strong> This chart displays the sustainability score for each selected material.
                                        Materials are sorted from highest to lowest score. Green bars indicate highly sustainable materials (8-10), while red bars indicate low sustainability (0-2).
                                    </p>
                                </div>
                            </div>

                            {/* Multi-criteria Analysis */}
                            <div className="bg-white rounded-xl shadow-lg p-6" id="multi-criteria-chart">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Multi-Criteria Analysis: Durability vs Environmental Impact
                                    </h2>
                                    <ChartExportButtons
                                        chartId="multi-criteria-chart"
                                        filename="multi_criteria_analysis"
                                    />
                                </div>
                                <ResponsiveContainer width="100%" height={300}>
                                    <ScatterChart data={(() => {
                                        const dataPoints = materials
                                            .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                                            .map(material => ({
                                                name: material['Material Name'],
                                                durability: (() => {
                                                    const durStr = (material['Durability'] || '').toLowerCase().trim();
                                                    if (durStr.includes('very high')) return 6;
                                                    if (durStr.includes('medium-high') || durStr.includes('medium high')) return 4;
                                                    if (durStr === 'high' || (durStr.includes('high') && !durStr.includes('medium'))) return 5;
                                                    if (durStr === 'medium' || (durStr.includes('medium') && !durStr.includes('low') && !durStr.includes('high'))) return 3;
                                                    if (durStr.includes('medium-low') || durStr.includes('medium low')) return 2;
                                                    if (durStr.includes('low') && !durStr.includes('medium')) return 1;
                                                    return 0;
                                                })(),
                                                durabilityLabel: material['Durability'] || 'N/A',
                                                environmentalImpact: (() => {
                                                    const envStr = (material['Environmental_Sustainability'] || '').toLowerCase().trim();
                                                    if (envStr.includes('very high')) return 6;
                                                    if (envStr.includes('medium-high') || envStr.includes('medium high')) return 4;
                                                    if (envStr === 'high' || (envStr.includes('high') && !envStr.includes('medium'))) return 5;
                                                    if (envStr === 'medium' || (envStr.includes('medium') && !envStr.includes('low') && !envStr.includes('high'))) return 3;
                                                    if (envStr.includes('medium-low') || envStr.includes('medium low')) return 2;
                                                    if (envStr.includes('low') && !envStr.includes('medium')) return 1;
                                                    return 0;
                                                })(),
                                                environmentalImpactLabel: material['Environmental_Sustainability'] || 'N/A'
                                            }))
                                            .filter(item => item.environmentalImpact > 0 && item.durability > 0);

                                        const grouped = {};
                                        dataPoints.forEach(item => {
                                            const key = `${item.durability}-${item.environmentalImpact}`;
                                            if (!grouped[key]) {
                                                grouped[key] = {
                                                    durability: item.durability,
                                                    environmentalImpact: item.environmentalImpact,
                                                    durabilityLabel: item.durabilityLabel,
                                                    environmentalImpactLabel: item.environmentalImpactLabel,
                                                    materials: []
                                                };
                                            }
                                            grouped[key].materials.push(item.name);
                                        });

                                        return Object.values(grouped);
                                    })()}>
                                        <CartesianGrid />
                                        <XAxis type="number" dataKey="durability" name="Durability" domain={[1, 6]} ticks={[1, 2, 3, 4, 5, 6]} />
                                        <YAxis type="number" dataKey="environmentalImpact" name="Environmental Impact" domain={[1, 6]} ticks={[1, 2, 3, 4, 5, 6]} />
                                        <Tooltip cursor={{ strokeDasharray: '3 3' }}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg max-w-xs">
                                                            <p className="font-bold text-gray-900 mb-2">
                                                                {data.materials.length > 1
                                                                    ? `${data.materials.length} Materials`
                                                                    : data.materials[0]}
                                                            </p>
                                                            {data.materials.length > 1 && (
                                                                <div className="mb-2 max-h-32 overflow-y-auto">
                                                                    {data.materials.map((mat, idx) => (
                                                                        <p key={idx} className="text-xs text-gray-600">• {mat}</p>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            <p className="text-sm text-gray-700">
                                                                Durability: <span className="font-semibold">{data.durabilityLabel} ({data.durability}/6)</span>
                                                            </p>
                                                            <p className="text-sm text-gray-700">
                                                                Environmental Impact: <span className="font-semibold">{data.environmentalImpactLabel} ({data.environmentalImpact}/6)</span>
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Scatter name="Materials" dataKey="environmentalImpact" fill="#3b82f6" />
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Cost vs Sustainability Correlation */}
                            <div className="bg-white rounded-xl shadow-lg p-6" id="cost-sustainability-chart">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Cost vs Sustainability Correlation
                                        </h2>
                                        <p className="text-sm text-gray-600">Analyzing the relationship between material cost and sustainability score</p>
                                    </div>
                                    <ChartExportButtons
                                        chartId="cost-sustainability-chart"
                                        filename="cost_sustainability_correlation"
                                    />
                                </div>
                                {/* Warning for excluded materials */}
                                <MissingDataWarning
                                    excludedMaterials={(() => {
                                        const allMaterialsData = materials
                                            .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                                            .map(material => {
                                                const costStr = String(material['Cost Range ($/kg)'] || '').toUpperCase();
                                                const sustainStr = String(material['Sustainability Score'] || '').toUpperCase();

                                                return {
                                                    name: material['Material Name'],
                                                    cost: (() => {
                                                        if (costStr.includes('N/A')) return 0;
                                                        const match = costStr.match(/[\d.]+/);
                                                        return match ? parseFloat(match[0]) : 0;
                                                    })(),
                                                    sustainability: (() => {
                                                        if (sustainStr.includes('N/A')) return 0;
                                                        return parseFloat(material['Sustainability Score']) || 0;
                                                    })(),
                                                    hasCostNA: costStr.includes('N/A'),
                                                    hasSustainNA: sustainStr.includes('N/A')
                                                };
                                            });

                                        return allMaterialsData
                                            .filter(item => item.cost <= 0 || item.sustainability <= 0)
                                            .map(material => {
                                                const reasons = [];
                                                if (material.cost <= 0) reasons.push('no cost');
                                                if (material.sustainability <= 0) reasons.push('no score');
                                                return {
                                                    name: material.name,
                                                    reason: reasons.join(', ')
                                                };
                                            });
                                    })()}
                                />
                                <ResponsiveContainer width="100%" height={350}>
                                    <ComposedChart
                                        data={materials
                                            .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                                            .map(material => ({
                                                name: (material['Material Name'] || '').length > 10 ?
                                                    (material['Material Name'] || '').substring(0, 10) + '...' :
                                                    (material['Material Name'] || ''),
                                                fullName: material['Material Name'],
                                                cost: (() => {
                                                    const costStr = material['Cost Range ($/kg)'] || '';
                                                    const match = costStr.match(/[\d.]+/);
                                                    return match ? parseFloat(match[0]) : 0;
                                                })(),
                                                sustainability: parseFloat(material['Sustainability Score']) || 0
                                            }))
                                            .filter(item => item.cost > 0 && item.sustainability > 0)
                                            .sort((a, b) => b.cost - a.cost)}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="name"
                                            angle={-45}
                                            textAnchor="end"
                                            height={80}
                                            fontSize={10}
                                            label={{ value: 'Material Name', position: 'insideBottom', offset: -10, fontSize: 12 }}
                                        />
                                        <YAxis
                                            yAxisId="left"
                                            label={{ value: 'Cost ($/kg)', angle: -90, position: 'insideLeft', fontSize: 12 }}
                                        />
                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                            domain={[0, 10]}
                                            label={{ value: 'Sustainability Score', angle: 90, position: 'insideRight', fontSize: 12 }}
                                        />
                                        <Tooltip
                                            formatter={(value, name, props) => {
                                                if (name === 'cost') {
                                                    return [`$${value}/kg`, 'Cost'];
                                                } else if (name === 'sustainability') {
                                                    return [value, 'Sustainability Score'];
                                                }
                                                return [value, name];
                                            }}
                                            labelFormatter={(label, payload) => {
                                                if (payload && payload.length > 0) {
                                                    return `Material: ${payload[0].payload.fullName}`;
                                                }
                                                return label;
                                            }}
                                        />
                                        <Legend
                                            wrapperStyle={{ paddingTop: '20px' }}
                                            formatter={(value) => {
                                                if (value === 'cost') return 'Cost ($/kg)';
                                                if (value === 'sustainability') return 'Sustainability Score';
                                                return value;
                                            }}
                                        />
                                        <Bar yAxisId="left" dataKey="cost" fill="#8b5cf6" name="cost" />
                                        <Line
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="sustainability"
                                            stroke="#10b981"
                                            strokeWidth={3}
                                            dot={{ fill: '#10b981', r: 5 }}
                                            name="sustainability"
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-gray-700">
                                        <strong>Interpretation:</strong> This chart shows the trade-off between cost and sustainability.
                                        Higher sustainability scores with lower costs indicate optimal material choices.
                                        Materials are sorted by cost from highest to lowest (left to right).
                                    </p>
                                </div>
                            </div>

                            {/* Radar Charts Section */}
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">📊 Radar Charts - Material Profiles</h2>
                                <p className="text-sm text-gray-600 mb-6">Multi-dimensional comparison of material properties</p>
                            </div>

                            {/* Single Material Environmental Profile */}
                            {selectedAnalyticsMaterials.length > 0 && (
                                <div className="bg-white rounded-xl shadow-lg p-6" id="radar-single-chart">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                                Single Material Environmental Profile (Normalized)
                                            </h2>
                                            <p className="text-sm text-gray-600 mb-3">Select a material to view its environmental profile</p>
                                            <select
                                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                                                value={singleRadarMaterial}
                                                onChange={(e) => setSingleRadarMaterial(e.target.value)}
                                            >
                                                <option value="">Choose a material...</option>
                                                {selectedAnalyticsMaterials.map((matName) => (
                                                    <option key={matName} value={matName}>{matName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {singleRadarMaterial && (
                                            <ChartExportButtons
                                                chartId="radar-single-chart"
                                                filename="radar_single_material_profile"
                                            />
                                        )}
                                    </div>

                                    {singleRadarMaterial ? (
                                        <>
                                            <MissingDataWarning
                                                excludedMaterials={(() => {
                                                    const selectedMat = materials.find(m => m['Material Name'] === singleRadarMaterial);
                                                    if (!selectedMat) return [];

                                                    const missingMetrics = [];
                                                    const sustainability = parseFloat(selectedMat['Sustainability Score']) || 0;
                                                    const ghgStr = String(selectedMat['GHG Emissions (kg CO2e/kg)'] || '').toUpperCase();
                                                    const waterStr = String(selectedMat['Water Consumption (L/kg)'] || '').toUpperCase();
                                                    const energyStr = String(selectedMat['Energy Use (MJ/kg)'] || '').toUpperCase();

                                                    if (sustainability === 0 || String(selectedMat['Sustainability Score']).toUpperCase().includes('N/A')) {
                                                        missingMetrics.push('Sustainability Score');
                                                    }
                                                    if (!ghgStr.match(/[\d.]+/) || ghgStr.includes('N/A')) {
                                                        missingMetrics.push('GHG Emissions');
                                                    }
                                                    if (!waterStr.match(/[\d.]+/) || waterStr.includes('N/A')) {
                                                        missingMetrics.push('Water Consumption');
                                                    }
                                                    if (!energyStr.match(/[\d.]+/) || energyStr.includes('N/A')) {
                                                        missingMetrics.push('Energy Use');
                                                    }

                                                    if (missingMetrics.length > 0) {
                                                        return [{ name: singleRadarMaterial, reason: missingMetrics.join(', ') }];
                                                    }
                                                    return [];
                                                })()}
                                            />
                                            <ResponsiveContainer width="100%" height={400}>
                                                <RadarChart data={(() => {
                                                    const selectedMat = materials.find(m => m['Material Name'] === singleRadarMaterial);
                                                    if (!selectedMat) return [];

                                                    const normalize = (value) => {
                                                        if (!value) return 0;
                                                        if (String(value).toUpperCase().includes('N/A')) return 0;
                                                        const num = parseFloat(value);
                                                        if (!isNaN(num)) {
                                                            return Math.max(0, Math.min(num, 6));
                                                        }
                                                        return 0;
                                                    };

                                                    return [
                                                        { metric: 'Sustainability', value: normalize(selectedMat['Sustainability Score']) },
                                                        {
                                                            metric: 'Low GHG',
                                                            value: (() => {
                                                                const ghgStr = String(selectedMat['GHG Emissions (kg CO2e/kg)'] || '');
                                                                if (ghgStr.toUpperCase().includes('N/A')) return 0;
                                                                const match = ghgStr.match(/[\d.]+/);
                                                                const ghg = match ? parseFloat(match[0]) : 0;
                                                                return Math.max(0, Math.min(6, 7 - (ghg / 10)));
                                                            })()
                                                        },
                                                        {
                                                            metric: 'Low Water',
                                                            value: (() => {
                                                                const waterStr = String(selectedMat['Water Consumption (L/kg)'] || '');
                                                                if (waterStr.toUpperCase().includes('N/A')) return 0;
                                                                const match = waterStr.match(/[\d.]+/);
                                                                const water = match ? parseFloat(match[0]) : 0;
                                                                return Math.max(0, Math.min(6, 7 - (water / 200)));
                                                            })()
                                                        },
                                                        {
                                                            metric: 'Low Energy',
                                                            value: (() => {
                                                                const energyStr = String(selectedMat['Energy Use (MJ/kg)'] || '');
                                                                if (energyStr.toUpperCase().includes('N/A')) return 0;
                                                                const match = energyStr.match(/[\d.]+/);
                                                                const energy = match ? parseFloat(match[0]) : 0;
                                                                return Math.max(0, Math.min(6, 7 - (energy / 20)));
                                                            })()
                                                        },
                                                        {
                                                            metric: 'Low Fossil Fuel',
                                                            value: (() => {
                                                                const fuelStr = String(selectedMat['Fuel Consumption (MJ/kg)'] || '').toLowerCase().trim();
                                                                const match = fuelStr.match(/[\d.]+/);
                                                                if (match) {
                                                                    const fuel = parseFloat(match[0]);
                                                                    return Math.max(0, Math.min(6, 7 - (fuel / 20)));
                                                                }
                                                                if (fuelStr.includes('veryhigh') || fuelStr.includes('very high')) return 1;
                                                                if (fuelStr.includes('high') && !fuelStr.includes('medium')) return 2;
                                                                if (fuelStr.includes('mediumhigh') || fuelStr.includes('medium-high') || fuelStr.includes('medium high')) return 2.5;
                                                                if (fuelStr.includes('medium') && !fuelStr.includes('low') && !fuelStr.includes('high')) return 3.5;
                                                                if (fuelStr.includes('mediumlow') || fuelStr.includes('medium-low') || fuelStr.includes('medium low')) return 4.5;
                                                                if (fuelStr.includes('low') && !fuelStr.includes('medium')) return 5;
                                                                if (fuelStr.includes('verylow') || fuelStr.includes('very low')) return 6;
                                                                return 0;
                                                            })()
                                                        }
                                                    ];
                                                })()}>
                                                    <PolarGrid stroke="#e5e7eb" />
                                                    <PolarAngleAxis dataKey="metric" tick={{ fill: '#374151', fontSize: 12 }} />
                                                    <PolarRadiusAxis angle={90} domain={[0, 6]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                                                    <Radar
                                                        name={singleRadarMaterial}
                                                        dataKey="value"
                                                        stroke="#10b981"
                                                        fill="#10b981"
                                                        fillOpacity={0.6}
                                                        strokeWidth={2}
                                                    />
                                                    <Tooltip />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </>
                                    ) : (
                                        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                                            <p className="text-gray-500">Select a material from the dropdown above to view its profile</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Multi Material Environmental Profile */}
                            {selectedAnalyticsMaterials.length > 0 && (
                                <div className="bg-white rounded-xl shadow-lg p-6" id="radar-1-chart">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">
                                                Multi Material Environmental Profile (Normalized)
                                            </h2>
                                            <p className="text-sm text-gray-600">Shows all selected materials with metrics on 1-6 scale</p>
                                        </div>
                                        <ChartExportButtons
                                            chartId="radar-1-chart"
                                            filename="radar_multi_material_profile"
                                        />
                                    </div>
                                    <MissingDataWarning
                                        excludedMaterials={materials
                                            .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                                            .map(material => {
                                                const missingMetrics = [];
                                                const sustainability = parseFloat(material['Sustainability Score']) || 0;
                                                const ghgStr = String(material['GHG Emissions (kg CO2e/kg)'] || '').toUpperCase();
                                                const waterStr = String(material['Water Consumption (L/kg)'] || '').toUpperCase();
                                                const energyStr = String(material['Energy Use (MJ/kg)'] || '').toUpperCase();

                                                if (sustainability === 0 || String(material['Sustainability Score']).toUpperCase().includes('N/A')) {
                                                    missingMetrics.push('Sustainability');
                                                }
                                                if (!ghgStr.match(/[\d.]+/) || ghgStr.includes('N/A')) {
                                                    missingMetrics.push('GHG');
                                                }
                                                if (!waterStr.match(/[\d.]+/) || waterStr.includes('N/A')) {
                                                    missingMetrics.push('Water');
                                                }
                                                if (!energyStr.match(/[\d.]+/) || energyStr.includes('N/A')) {
                                                    missingMetrics.push('Energy');
                                                }

                                                return { name: material['Material Name'], metrics: missingMetrics };
                                            })
                                            .filter(item => item.metrics.length > 0)
                                            .map(item => ({ name: item.name, reason: item.metrics.join(', ') }))}
                                    />
                                    <ResponsiveContainer width="100%" height={400}>
                                        <RadarChart data={(() => {
                                            const selectedMats = materials.filter(m => selectedAnalyticsMaterials.includes(m['Material Name']));

                                            const normalize = (value) => {
                                                if (!value) return 0;
                                                if (String(value).toUpperCase().includes('N/A')) return 0;
                                                const num = parseFloat(value);
                                                if (!isNaN(num)) {
                                                    return Math.max(0, Math.min(num, 6));
                                                }
                                                return 0;
                                            };

                                            return [
                                                {
                                                    metric: 'Sustainability',
                                                    ...Object.fromEntries(selectedMats.map(m => [m['Material Name'], normalize(m['Sustainability Score'])]))
                                                },
                                                {
                                                    metric: 'Low GHG',
                                                    ...Object.fromEntries(selectedMats.map(m => {
                                                        const ghgStr = String(m['GHG Emissions (kg CO2e/kg)'] || '');
                                                        if (ghgStr.toUpperCase().includes('N/A')) return [m['Material Name'], 0];
                                                        const match = ghgStr.match(/[\d.]+/);
                                                        const ghg = match ? parseFloat(match[0]) : 0;
                                                        return [m['Material Name'], Math.max(0, Math.min(6, 7 - (ghg / 10)))];
                                                    }))
                                                },
                                                {
                                                    metric: 'Low Water',
                                                    ...Object.fromEntries(selectedMats.map(m => {
                                                        const waterStr = String(m['Water Consumption (L/kg)'] || '');
                                                        if (waterStr.toUpperCase().includes('N/A')) return [m['Material Name'], 0];
                                                        const match = waterStr.match(/[\d.]+/);
                                                        const water = match ? parseFloat(match[0]) : 0;
                                                        return [m['Material Name'], Math.max(0, Math.min(6, 7 - (water / 200)))];
                                                    }))
                                                },
                                                {
                                                    metric: 'Low Energy',
                                                    ...Object.fromEntries(selectedMats.map(m => {
                                                        const energyStr = String(m['Energy Use (MJ/kg)'] || '');
                                                        if (energyStr.toUpperCase().includes('N/A')) return [m['Material Name'], 0];
                                                        const match = energyStr.match(/[\d.]+/);
                                                        const energy = match ? parseFloat(match[0]) : 0;
                                                        return [m['Material Name'], Math.max(0, Math.min(6, 7 - (energy / 20)))];
                                                    }))
                                                },
                                                {
                                                    metric: 'Low Fossil Fuel',
                                                    ...Object.fromEntries(selectedMats.map(m => {
                                                        const fuelStr = String(m['Fuel Consumption (MJ/kg)'] || '').toLowerCase().trim();
                                                        const match = fuelStr.match(/[\d.]+/);
                                                        if (match) {
                                                            const fuel = parseFloat(match[0]);
                                                            return [m['Material Name'], Math.max(0, Math.min(6, 7 - (fuel / 20)))];
                                                        }
                                                        if (fuelStr.includes('veryhigh') || fuelStr.includes('very high')) return [m['Material Name'], 1];
                                                        if (fuelStr.includes('high') && !fuelStr.includes('medium')) return [m['Material Name'], 2];
                                                        if (fuelStr.includes('mediumhigh') || fuelStr.includes('medium-high') || fuelStr.includes('medium high')) return [m['Material Name'], 2.5];
                                                        if (fuelStr.includes('medium') && !fuelStr.includes('low') && !fuelStr.includes('high')) return [m['Material Name'], 3.5];
                                                        if (fuelStr.includes('mediumlow') || fuelStr.includes('medium-low') || fuelStr.includes('medium low')) return [m['Material Name'], 4.5];
                                                        if (fuelStr.includes('low') && !fuelStr.includes('medium')) return [m['Material Name'], 5];
                                                        if (fuelStr.includes('verylow') || fuelStr.includes('very low')) return [m['Material Name'], 6];
                                                        return [m['Material Name'], 0];
                                                    }))
                                                }
                                            ];
                                        })()}>
                                            <PolarGrid stroke="#e5e7eb" />
                                            <PolarAngleAxis dataKey="metric" tick={{ fill: '#374151', fontSize: 12 }} />
                                            <PolarRadiusAxis angle={90} domain={[0, 6]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                                            {selectedAnalyticsMaterials.map((matName, idx) => (
                                                <Radar
                                                    key={matName}
                                                    name={matName}
                                                    dataKey={matName}
                                                    stroke={['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'][idx % 8]}
                                                    fill={['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'][idx % 8]}
                                                    fillOpacity={0.3}
                                                />
                                            ))}
                                            <Legend />
                                            <Tooltip />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Analytics;
