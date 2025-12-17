import avilaFlag from '../assets/images/flags/avila_region.webp';
import burgosFlag from '../assets/images/flags/burgos_region.webp';
import leonFlag from '../assets/images/flags/leon_region.webp';
import palenciaFlag from '../assets/images/flags/palencia_region.webp';
import salamancaFlag from '../assets/images/flags/salamanca_region.webp';
import segoviaFlag from '../assets/images/flags/segovia_region.webp';
import soriaFlag from '../assets/images/flags/soria_region.webp';
import valladolidFlag from '../assets/images/flags/valladolid_region.webp';
import zamoraFlag from '../assets/images/flags/zamora_region.webp';
import valladolidCityFlag from '../assets/images/flags/valladolid_city.webp';
import cylFlag from '../assets/images/flags/castile_and_leon.webp';

export interface GameDefinition {
    id: string;
    name: string;
    description?: string;
    flag?: string;
}

export interface RegionNode {
    name: string;
    games: GameDefinition[];
}

export interface CountryNode {
    name: string;
    regions: Record<string, RegionNode>;
}

export interface ContinentNode {
    name: string;
    countries: Record<string, CountryNode>;
}

export const WORLD_DATA: Record<string, ContinentNode> = {
    europe: {
        name: 'Europa',
        countries: {
            spain: {
                name: 'España',
                regions: {
                    castilla_y_leon: { // standardized key
                        name: 'Castilla y León',
                        games: [
                            { id: 'castilla_y_leon_provinces', name: 'Provincias de Castilla y León', description: 'Identifica las 9 provincias de la comunidad', flag: cylFlag },
                            { id: 'castilla_y_leon_cities', name: 'Ciudades de Castilla y León', description: 'Ubica las principales ciudades de la comunidad', flag: cylFlag },
                            { id: 'avila', name: 'Ávila', description: 'Ubica todos los municipios de la provincia de Ávila en el mapa', flag: avilaFlag },
                            { id: 'burgos', name: 'Burgos', description: 'Ubica todos los municipios de la provincia de Burgos en el mapa', flag: burgosFlag },
                            { id: 'leon', name: 'León', description: 'Ubica todos los municipios de la provincia de León en el mapa', flag: leonFlag },
                            { id: 'palencia', name: 'Palencia', description: 'Ubica todos los municipios de la provincia de Palencia en el mapa', flag: palenciaFlag },
                            { id: 'salamanca', name: 'Salamanca', description: 'Ubica todos los municipios de la provincia Salamanca en el mapa', flag: salamancaFlag },
                            { id: 'segovia', name: 'Segovia', description: 'Ubica todos los municipios de la provincia Segovia en el mapa', flag: segoviaFlag },
                            { id: 'soria', name: 'Soria', description: 'Ubica todos los municipios de la provincia Soria en el mapa', flag: soriaFlag },
                            { id: 'valladolid', name: 'Valladolid', description: 'Ubica todos los municipios de Valladolid en el mapa', flag: valladolidFlag },
                            { id: 'zamora', name: 'Zamora', description: 'Ubica todos los municipios de Zamora en el mapa', flag: zamoraFlag },
                            { id: 'barrios_valladolid', name: 'Barrios de Valladolid', description: 'Localiza los diferentes barrios de la ciudad de Valladolid', flag: valladolidCityFlag },
                        ]
                    }
                }
            }
        }
    }
};

// Helper to find path for a game ID
// Returns [continentKey, countryKey, regionKey, gameName] or null
export const findGamePath = (gameId: string): { path: { label: string, url: string }[], gameName: string, flag?: string } | null => {
    for (const [contKey, cont] of Object.entries(WORLD_DATA)) {
        for (const [countryKey, country] of Object.entries(cont.countries)) {
            for (const [regionKey, region] of Object.entries(country.regions)) {
                const game = region.games.find(g => g.id === gameId);
                if (game) {
                    return {
                        path: [
                            { label: cont.name, url: `/${contKey}` },
                            { label: country.name, url: `/${contKey}/${countryKey}` },
                            { label: region.name, url: `/${contKey}/${countryKey}/${regionKey}` }
                        ],
                        gameName: game.name,
                        flag: game.flag
                    };
                }
            }
        }
    }
    return null;
};
