import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DATA_DIR = path.resolve(__dirname, '../src/data');
const PUBLIC_DIR = path.resolve(__dirname, '../public/europe/spain');

// Province to Region (English) mapping
// Note: This needs to cover all provinces found in src/data
const PROVINCE_TO_REGION = {
    'avila': 'castile_and_leon',
    'burgos': 'castile_and_leon',
    'leon': 'castile_and_leon',
    'palencia': 'castile_and_leon',
    'salamanca': 'castile_and_leon',
    'segovia': 'castile_and_leon',
    'soria': 'castile_and_leon',
    'valladolid': 'castile_and_leon',
    'zamora': 'castile_and_leon',
    'castilla_y_leon': 'castile_and_leon', // For provincies/cities files
    'castile_and_leon': 'castile_and_leon',

    'a_coruña': 'galicia',
    'lugo': 'galicia',
    'ourense': 'galicia',
    'pontevedra': 'galicia',
    'galicia': 'galicia',

    'asturias': 'asturias',

    'cantabria': 'cantabria',

    'alava': 'basque_country',
    'biscay': 'basque_country',
    'gipuzkoa': 'basque_country',
    'basque_country': 'basque_country',

    'la_rioja': 'la_rioja',

    'navarra': 'navarre',

    'huesca': 'aragon',
    'teruel': 'aragon',
    'zaragoza': 'aragon',
    'aragon': 'aragon',

    'barcelona': 'catalonia',
    'girona': 'catalonia',
    'lleida': 'catalonia',
    'tarragona': 'catalonia',
    'catalonia': 'catalonia',

    'valencia': 'valencian_community',
    'alicante': 'valencian_community',
    'castellon': 'valencian_community',
    'valencian_community': 'valencian_community',

    'murcia': 'murcia',

    'albacete': 'castile_la_mancha',
    'ciudad_real': 'castile_la_mancha',
    'cuenca': 'castile_la_mancha',
    'guadalajara': 'castile_la_mancha',
    'toledo': 'castile_la_mancha',
    'castile_la_mancha': 'castile_la_mancha',
    'castile_la_mancha_provincias': 'castile_la_mancha', // Explicit mapping

    'badajoz': 'extremadura',
    'caceres': 'extremadura',
    'extremadura': 'extremadura',
    'extremadura_provinces': 'extremadura', // Explicit mapping just in case

    'almeria': 'andalusia',
    'cadiz': 'andalusia',
    'cordoba': 'andalusia',
    'granada': 'andalusia',
    'huelva': 'andalusia',
    'jaen': 'andalusia',
    'malaga': 'andalusia',
    'sevilla': 'andalusia',
    'andalusia': 'andalusia',

    'madrid': 'madrid_community',
    'madrid_community': 'madrid_community',

    'mallorca': 'balearic_islands',
    'menorca': 'balearic_islands',
    'ibiza': 'balearic_islands',
    'formentera': 'balearic_islands',
    'balearic_islands': 'balearic_islands',

    // General Spain maps
    'spain_autonomous_communities': 'general',
    'spain_provinces': 'general'
};

const IGNORED_FILES = ['navigation.ts'];

async function processFiles() {
    if (!fs.existsSync(PUBLIC_DIR)) {
        fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }

    const files = fs.readdirSync(SRC_DATA_DIR);

    // Map to store discovered structure for navigation.ts updates
    const structure = {};

    for (const file of files) {
        if (IGNORED_FILES.includes(file)) continue;

        const filePath = path.join(SRC_DATA_DIR, file);
        const ext = path.extname(file);

        if (ext !== '.json' && ext !== '.geojson') continue;

        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            let json;
            try {
                json = JSON.parse(content);
            } catch (e) {
                console.error(`Failed to parse JSON file: ${file}`);
                continue;
            }

            // Determine ID and Region
            // Heuristic strategies for ID renaming:
            // 1. "alava_municipalities.geojson" -> "alava"
            // 2. "municipios_valladolid.json" -> "valladolid" (legacy support if present)
            // 3. "valladolid_districts.json" -> "valladolid_districts"
            // 4. "castile_and_leon_provinces.json" -> "castilla_y_leon_provinces" (keep descriptive)

            let id = path.basename(file, ext);
            id = id.replace(/_municipalities$/, ''); // common pattern cleanup

            // Try to find region
            // Split ID by underscore and look for known provinces
            let regionKey = null;
            const parts = id.split('_');

            // Try distinct parts first (e.g. "a_coruña" -> "a_coruña" is tricky if we just split, but let's try full match first)

            // Check exact ID match in map first
            if (PROVINCE_TO_REGION[id]) {
                regionKey = PROVINCE_TO_REGION[id];
            } else {
                // Check if any part of the ID generally matches a province
                for (const part of parts) {
                    if (PROVINCE_TO_REGION[part]) {
                        regionKey = PROVINCE_TO_REGION[part];
                        break;
                    }
                }

                // Special case: compound names like "ciudad_real" or "la_rioja"
                if (!regionKey) {
                    const twoPart = parts.slice(0, 2).join('_');
                    if (PROVINCE_TO_REGION[twoPart]) regionKey = PROVINCE_TO_REGION[twoPart];
                }
            }

            if (!regionKey) {
                console.warn(`Could not determine region for ${file} (ID: ${id}). Skipping or placing in 'unknown'.`);
                regionKey = 'unknown';
            }

            // Create region directory
            const regionDir = path.join(PUBLIC_DIR, regionKey);
            if (!fs.existsSync(regionDir)) {
                fs.mkdirSync(regionDir, { recursive: true });
            }

            // Output path
            const outName = `${id}.json`;
            const outPath = path.join(regionDir, outName);

            // Minify and write
            fs.writeFileSync(outPath, JSON.stringify(json));
            console.log(`Processed ${file} -> ${regionKey}/${outName}`);

            // Track structure
            if (!structure[regionKey]) structure[regionKey] = [];
            structure[regionKey].push(id);

        } catch (err) {
            console.error(`Error processing ${file}:`, err);
        }
    }

    console.log('\n--- Detected Structure ---');
    console.log(JSON.stringify(structure, null, 2));
}

processFiles();
