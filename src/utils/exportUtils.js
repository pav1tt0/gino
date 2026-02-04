import toast from 'react-hot-toast';

export const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
        toast.error('No data to export');
        return;
    }

    // Get all unique keys from the data
    const keys = Object.keys(data[0]);

    // Create CSV header
    const csvHeader = keys.join(',');

    // Create CSV rows
    const csvRows = data.map(item =>
        keys.map(key => {
            const value = item[key] || '';
            let safeValue = String(value);
            // Prevent CSV formula injection in Excel/Sheets
            if (/^\s*[=+\-@]/.test(safeValue)) {
                safeValue = `'${safeValue}`;
            }
            // Escape commas and quotes in values
            const escaped = safeValue.replace(/"/g, '""');
            return `"${escaped}"`;
        }).join(',')
    );

    // Combine header and rows
    const csvContent = [csvHeader, ...csvRows].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${data.length} materials to CSV!`);
};

export const exportToJSON = (data, filename) => {
    if (!data || data.length === 0) {
        toast.error('No data to export');
        return;
    }

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${data.length} materials to JSON!`);
};
