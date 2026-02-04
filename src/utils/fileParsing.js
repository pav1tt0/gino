import Papa from 'papaparse';

// Normalize column name - INTELLIGENT mapping (IT + EN + Keyword matching)
export const normalizeColumnName = (name) => {
    if (!name) return '';

    const cleaned = name.trim()
        .replace(/['"]/g, '')
        .replace(/[_-]/g, ' ')
        .replace(/\s+/g, ' ')
        .toLowerCase();

    const exactMatchMap = {
        'material id': 'Material ID',
        'id materiale': 'Material ID',
        'material name': 'Material Name',
        'nome materiale': 'Material Name',
        'materiale': 'Material Name',
        'nome': 'Material Name',
        'material': 'Material Name',
        'category': 'Category',
        'categories': 'Category',
        'categoria': 'Category',
        'categorie': 'Category',
        'tipo': 'Category',
        'tipi': 'Category',
        'tipologia': 'Category',
        'sustainability rating': 'Sustainability Rating',
        'valutazione sostenibilita': 'Sustainability Rating',
        'sustainability score': 'Sustainability Score',
        'punteggio sostenibilita': 'Sustainability Score',
        'sostenibilita': 'Sustainability Score',
        'environmental sustainability': 'Environmental_Sustainability',
        'sostenibilita ambientale': 'Environmental_Sustainability',
        'ghg emissions': 'GHG Emissions (kg CO2e/kg)',
        'emissioni ghg': 'GHG Emissions (kg CO2e/kg)',
        'emissioni co2': 'GHG Emissions (kg CO2e/kg)',
        'co2': 'GHG Emissions (kg CO2e/kg)',
        'emissioni': 'GHG Emissions (kg CO2e/kg)',
        'carbon footprint': 'GHG Emissions (kg CO2e/kg)',
        'impronta carbonio': 'GHG Emissions (kg CO2e/kg)',
        'water consumption': 'Water Consumption (L/kg)',
        'consumo acqua': 'Water Consumption (L/kg)',
        'consumo idrico': 'Water Consumption (L/kg)',
        'acqua': 'Water Consumption (L/kg)',
        'uso acqua': 'Water Consumption (L/kg)',
        'energy use': 'Energy Use (MJ/kg)',
        'consumo energia': 'Energy Use (MJ/kg)',
        'consumo energetico': 'Energy Use (MJ/kg)',
        'energia': 'Energy Use (MJ/kg)',
        'uso energia': 'Energy Use (MJ/kg)',
        'fuel consumption': 'Fuel Consumption (MJ/kg)',
        'consumo carburante': 'Fuel Consumption (MJ/kg)',
        'carburante': 'Fuel Consumption (MJ/kg)',
        'land use': 'Land Use',
        'uso suolo': 'Land Use',
        'consumo suolo': 'Land Use',
        'suolo': 'Land Use',
        'occupazione suolo': 'Land Use',
        'chemical use level': 'Chemical Use Level',
        'uso sostanze chimiche': 'Chemical Use Level',
        'livello chimici': 'Chemical Use Level',
        'sostanze chimiche': 'Chemical Use Level',
        'toxicity': 'Toxicity',
        'tossicita': 'Toxicity',
        'tossico': 'Toxicity',
        'biodegradability': 'Biodegradability',
        'biodegradabilita': 'Biodegradability',
        'biodegradabile': 'Biodegradability',
        'social sustainability': 'Social Sustainability',
        'sostenibilita sociale': 'Social Sustainability',
        'governance': 'Governance',
        'governanza': 'Governance',
        'durability': 'Durability',
        'durabilita': 'Durability',
        'durata': 'Durability',
        'resistenza': 'Durability',
        'tensile strength': 'Tensile Strength (MPa)',
        'resistenza trazione': 'Tensile Strength (MPa)',
        'trazione': 'Tensile Strength (MPa)',
        'abrasion resistance': 'Abrasion Resistance',
        'resistenza abrasione': 'Abrasion Resistance',
        'abrasione': 'Abrasion Resistance',
        'chemical resistance': 'Chemical Resistance',
        'resistenza chimica': 'Chemical Resistance',
        'moisture absorption': 'Moisture Absorption',
        'assorbimento umidita': 'Moisture Absorption',
        'umidita': 'Moisture Absorption',
        'temperature resistance': 'Temperature Resistance',
        'resistenza temperatura': 'Temperature Resistance',
        'temperatura': 'Temperature Resistance',
        'elasticity': 'Elasticity',
        'elasticita': 'Elasticity',
        'dyeability': 'Dyeability',
        'tingibilita': 'Dyeability',
        'comfort level': 'Comfort Level',
        'livello comfort': 'Comfort Level',
        'comfort': 'Comfort Level',
        'confort': 'Comfort Level',
        'cost range': 'Cost Range ($/kg)',
        'costo': 'Cost Range ($/kg)',
        'prezzo': 'Cost Range ($/kg)',
        'fascia prezzo': 'Cost Range ($/kg)',
        'cost volatility': 'Cost Volatility',
        'volatilita costo': 'Cost Volatility',
        'variabilita prezzo': 'Cost Volatility',
        'primary applications': 'Primary Applications',
        'applicazioni principali': 'Primary Applications',
        'applicazioni': 'Primary Applications',
        'utilizzo': 'Primary Applications',
        'usi': 'Primary Applications',
        'main challenges': 'Main Challenges',
        'sfide principali': 'Main Challenges',
        'sfide': 'Main Challenges',
        'criticita': 'Main Challenges',
        'key opportunities': 'Key Opportunities',
        'opportunita chiave': 'Key Opportunities',
        'opportunita': 'Key Opportunities',
        'data source 1': 'Data Source 1',
        'fonte dati 1': 'Data Source 1',
        'data source 1 date': 'Data Source 1 Date',
        'data fonte 1': 'Data Source 1 Date',
        'data source 1 url': 'Data Source 1 URL',
        'url fonte 1': 'Data Source 1 URL',
        'data source 2': 'Data Source 2',
        'fonte dati 2': 'Data Source 2',
        'data source 2 date': 'Data Source 2 Date',
        'data fonte 2': 'Data Source 2 Date',
        'data source 2 url': 'Data Source 2 URL',
        'url fonte 2': 'Data Source 2 URL',
        'data source 3': 'Data Source 3',
        'fonte dati 3': 'Data Source 3',
        'data source 3 date': 'Data Source 3 Date',
        'data fonte 3': 'Data Source 3 Date',
        'data source 3 url': 'Data Source 3 URL',
        'url fonte 3': 'Data Source 3 URL',
    };

    if (exactMatchMap[cleaned]) {
        return exactMatchMap[cleaned];
    }

    const keywordMatches = [
        { keywords: ['id', 'codice'], target: 'Material ID' },
        { keywords: ['materiale', 'material', 'nome', 'name', 'denominazione'], target: 'Material Name' },
        { keywords: ['categoria', 'category', 'tipo', 'type'], target: 'Category' },
        { keywords: ['co2', 'ghg', 'emissioni', 'emissions', 'carbonio', 'carbon'], target: 'GHG Emissions (kg CO2e/kg)' },
        { keywords: ['acqua', 'water', 'idrico', 'idrica'], target: 'Water Consumption (L/kg)' },
        { keywords: ['energia', 'energy', 'energetico', 'energetica'], target: 'Energy Use (MJ/kg)' },
        { keywords: ['suolo', 'land', 'terreno'], target: 'Land Use' },
        { keywords: ['costo', 'cost', 'prezzo', 'price'], target: 'Cost Range ($/kg)' },
        { keywords: ['sostenibilita', 'sustainability', 'sostenibile', 'sustainable'], target: 'Sustainability Score' },
        { keywords: ['durabilita', 'durability', 'durata', 'resistenza'], target: 'Durability' },
        { keywords: ['applicazioni', 'applications', 'utilizzo', 'usi', 'use'], target: 'Primary Applications' },
    ];

    for (const match of keywordMatches) {
        for (const keyword of match.keywords) {
            if (cleaned.includes(keyword)) {
                return match.target;
            }
        }
    }

    return name.trim();
};

export const parseSQLFile = (content) => {
    const materials = [];
    let columns = [];

    const insertCount = (content.match(/INSERT\s+INTO\s+\w+/gi) || []).length;
    if (insertCount > 1) {
        console.warn('SQL contains multiple INSERT statements; parser handles simple cases only.');
    }

    const createTableMatch = content.match(/CREATE\s+TABLE\s+\w+\s*\(([\s\S]*?)\);/i);
    if (createTableMatch) {
        const columnDefs = createTableMatch[1];
        columns = columnDefs.split(',').map(col => {
            const colName = col.trim().split(/\s+/)[0].replace(/[`'"]/g, '');
            return colName;
        }).filter(col => col.length > 0);
    }

    if (columns.length === 0) {
        const insertMatch = content.match(/INSERT\s+INTO\s+\w+\s*\(\s*([^)]+)\)/i);
        if (insertMatch) {
            columns = insertMatch[1].split(',').map(col => col.trim().replace(/[`'"]/g, ''));
        }
    }

    const insertRegex = /INSERT\s+INTO\s+\w+(?:\s*\([^)]*\))?\s+VALUES\s*\(([^)]+)\)/gi;
    let match;

    while ((match = insertRegex.exec(content)) !== null) {
        const values = [];
        const valueString = match[1];
        let current = '';
        let inQuotes = false;
        let quoteChar = '';

        for (let i = 0; i < valueString.length; i++) {
            const char = valueString[i];

            if ((char === '"' || char === "'") && !inQuotes) {
                inQuotes = true;
                quoteChar = char;
            } else if (char === quoteChar && inQuotes) {
                inQuotes = false;
                quoteChar = '';
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim().replace(/^['"]|['"]$/g, ''));
                current = '';
                continue;
            }

            if (char !== quoteChar || inQuotes) {
                current += char;
            }
        }
        values.push(current.trim().replace(/^['"]|['"]$/g, ''));

        const material = {};
        columns.forEach((column, index) => {
            material[normalizeColumnName(column)] = values[index] || '';
        });
        materials.push(material);
    }

    if (insertCount > 1 && materials.length === 0) {
        throw new Error('SQL file appears complex (multiple INSERTs). Please export as CSV for best results.');
    }

    return materials;
};

export const parseCSVFile = (content) => {
    if (!content || content.trim().length === 0) {
        throw new Error('Empty file');
    }

    const parseResult = Papa.parse(content, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
        transformHeader: (header) => normalizeColumnName(header),
        delimiter: '',
        encoding: 'UTF-8',
        quoteChar: '"',
        escapeChar: '"',
    });

    if (parseResult.errors.length > 0) {
        console.warn('CSV parsing warnings:', parseResult.errors);
        const criticalErrors = parseResult.errors.filter(err => err.type === 'Quotes' || err.type === 'FieldMismatch');
        if (criticalErrors.length > 0) {
            throw new Error(`CSV parsing error: ${criticalErrors[0].message}`);
        }
    }

    const materials = parseResult.data.filter(row => {
        return Object.values(row).some(val => val && val.toString().trim());
    });

    if (materials.length === 0) {
        throw new Error('No valid data rows found in CSV');
    }

    return materials;
};
