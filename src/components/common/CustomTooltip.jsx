import React from 'react';

const CustomTooltip = ({ active, payload, label, unit }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg" style={{ maxWidth: '300px' }}>
                <p className="font-semibold text-gray-900 mb-1 break-words">{data.fullName || label}</p>
                <p className="text-sm text-gray-700">
                    <span className="font-medium">{payload[0].name}:</span> {payload[0].value} {unit}
                </p>
            </div>
        );
    }
    return null;
};

export default CustomTooltip;
