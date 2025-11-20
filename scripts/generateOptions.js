import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read country codes
const countryWorkbook = XLSX.readFile(path.join(__dirname, '../国家码.xlsx'));
const countrySheet = countryWorkbook.Sheets[countryWorkbook.SheetNames[0]];
const countryData = XLSX.utils.sheet_to_json(countrySheet, { header: 1 });

// Read ICC codes
const iccWorkbook = XLSX.readFile(path.join(__dirname, '../icc.xlsx'));
const iccSheet = iccWorkbook.Sheets[iccWorkbook.SheetNames[0]];
const iccData = XLSX.utils.sheet_to_json(iccSheet, { header: 1 });

// Convert to TypeScript format, skip first row (header)
const countryOptions = countryData
    .slice(1) // Skip header row
    .filter(row => row[0] && row[1])
    .map(row => ({
        value: String(row[0]),
        label: String(row[1])
    }));

const iccOptions = iccData
    .slice(1) // Skip header row
    .filter(row => row[0] && row[1])
    .map(row => ({
        value: String(row[0]),
        label: String(row[1])
    }));

// Generate TypeScript file
const tsContent = `// Auto-generated from Excel files
// 国家码选项
export const COUNTRY_CODE_OPTIONS = ` + JSON.stringify(countryOptions, null, 2) + `;

// ICC 选项
export const ICC_OPTIONS = ` + JSON.stringify(iccOptions, null, 2) + `;
`;

fs.writeFileSync(path.join(__dirname, '../src/constants/predefinedOptions.ts'), tsContent);

console.log('Generated predefinedOptions.ts');
console.log(`Country codes: ${countryOptions.length} items`);
console.log(`ICC codes: ${iccOptions.length} items`);
