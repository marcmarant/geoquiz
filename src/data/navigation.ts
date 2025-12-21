import avilaFlag from '../assets/images/flags/avila_province.webp';
import burgosFlag from '../assets/images/flags/burgos_province.webp';
import leonFlag from '../assets/images/flags/leon_province.webp';
import palenciaFlag from '../assets/images/flags/palencia_province.webp';
import salamancaFlag from '../assets/images/flags/salamanca_province.webp';
import segoviaFlag from '../assets/images/flags/segovia_province.webp';
import soriaFlag from '../assets/images/flags/soria_province.webp';
import valladolidFlag from '../assets/images/flags/valladolid_province.webp';
import zamoraFlag from '../assets/images/flags/zamora_province.webp';
import valladolidCityFlag from '../assets/images/flags/valladolid_city.webp';
import castileAndLeonFlag from '../assets/images/flags/castile_and_leon.webp';
import corunaFlag from '../assets/images/flags/a_coruña_province.webp';
import lugoFlag from '../assets/images/flags/lugo_province.webp';
import ourenseFlag from '../assets/images/flags/ourense_province.webp';
import pontevedraFlag from '../assets/images/flags/pontevedra_province.webp';
import andalusiaFlag from '../assets/images/flags/andalusia.webp';
import aragonFlag from '../assets/images/flags/aragon.webp';
import asturiasFlag from '../assets/images/flags/asturias.webp';
import balearicFlag from '../assets/images/flags/balearic_islands.webp';
import basqueFlag from '../assets/images/flags/basque_country.webp';
import alavaFlag from '../assets/images/flags/alava.webp';
import biscayFlag from '../assets/images/flags/biscay.webp';
import gipuzkoaFlag from '../assets/images/flags/gipuzkoa.webp';
import cantabriaFlag from '../assets/images/flags/cantabria.webp';
import castileLaManchaFlag from '../assets/images/flags/castile_la_mancha.webp';
import cataloniaFlag from '../assets/images/flags/catalonia.webp';
import extremaduraFlag from '../assets/images/flags/extremadura.webp';
import galiciaFlag from '../assets/images/flags/galicia.webp';
import laRiojaFlag from '../assets/images/flags/la_rioja.webp';
import madridFlag from '../assets/images/flags/madrid_community.webp';
import murciaFlag from '../assets/images/flags/murcia.webp';
import navarraFlag from '../assets/images/flags/navarra.webp';
import valenciaFlag from '../assets/images/flags/valencian_community.webp';
import spainFlag from '../assets/images/flags/spain.webp';
import albaceteFlag from '../assets/images/flags/albacete_province.webp';
import alicanteFlag from '../assets/images/flags/alicante_province.webp';
import almeriaFlag from '../assets/images/flags/almeria_province.webp';
import badajozFlag from '../assets/images/flags/badajoz_province.webp';
import barcelonaFlag from '../assets/images/flags/barcelona_province.webp';
import caceresFlag from '../assets/images/flags/caceres_province.webp';
import cadizFlag from '../assets/images/flags/cadiz_province.webp';
import castellonFlag from '../assets/images/flags/castellon_province.webp';
import ciudadRealFlag from '../assets/images/flags/ciudad_real_province.webp';
import cordobaFlag from '../assets/images/flags/cordoba_province.webp';
import cuencaFlag from '../assets/images/flags/cuenca_province.webp';
import gironaFlag from '../assets/images/flags/girona_province.webp';
import granadaFlag from '../assets/images/flags/granada_provincia.png';
import guadalajaraFlag from '../assets/images/flags/guadalajara_province.webp';
import huelvaFlag from '../assets/images/flags/huelva_province.webp';
import huescaFlag from '../assets/images/flags/huesca_province.webp';
import jaenFlag from '../assets/images/flags/jaen_province.webp';
import lleidaFlag from '../assets/images/flags/lleida_province.webp';
import malagaFlag from '../assets/images/flags/malaga_province.webp';
import sevillaFlag from '../assets/images/flags/sevilla_province.webp';
import tarragonaFlag from '../assets/images/flags/tarragona_province.webp';
import teruelFlag from '../assets/images/flags/teruel_province.webp';
import toledoFlag from '../assets/images/flags/toledo_province.webp';
import zaragozaFlag from '../assets/images/flags/zaragoza_province.webp';

export interface GameDefinition {
    id: string;
    name: string;
    description?: string;
    flag?: string;
}

export interface RegionNode {
    name: string;
    flag?: string;
    games: GameDefinition[];
}

export interface CountryNode {
    name: string;
    flag?: string;
    regions: Record<string, RegionNode>;
}

export interface ContinentNode {
    name: string;
    flag?: string;
    countries: Record<string, CountryNode>;
}

export const WORLD_DATA: Record<string, ContinentNode> = {
    europe: {
        name: 'Europa',
        countries: {
            spain: {
                name: 'España',
                flag: spainFlag,
                regions: {
                    general: {
                        name: 'General',
                        flag: spainFlag,
                        games: [
                            { id: 'spain_autonomous_communities', name: 'Comunidades Autónomas', description: 'Ubica las comunidades autónomas de España', flag: spainFlag },
                            { id: 'spain_provinces', name: 'Provincias', description: 'Ubica todas las provincias de España', flag: spainFlag }
                        ]
                    },
                    andalusia: {
                        name: 'Andalucía',
                        flag: andalusiaFlag,
                        games: [
                            { id: 'andalusia_provinces', name: 'Provincias de Andalucía', description: 'Identifica las 8 provincias de la comunidad', flag: andalusiaFlag },
                            { id: 'almeria', name: 'Almería', flag: almeriaFlag },
                            { id: 'cadiz', name: 'Cádiz', flag: cadizFlag },
                            { id: 'cordoba', name: 'Córdoba', flag: cordobaFlag },
                            { id: 'granada', name: 'Granada', flag: granadaFlag },
                            { id: 'huelva', name: 'Huelva', flag: huelvaFlag },
                            { id: 'jaen', name: 'Jaén', flag: jaenFlag },
                            { id: 'malaga', name: 'Málaga', flag: malagaFlag },
                            { id: 'sevilla', name: 'Sevilla', flag: sevillaFlag }
                        ]
                    },
                    aragon: {
                        name: 'Aragón',
                        flag: aragonFlag,
                        games: [
                            { id: 'aragon_provinces', name: 'Provincias de Aragón', description: 'Identifica las 3 provincias de la comunidad', flag: aragonFlag },
                            { id: 'huesca', name: 'Huesca', flag: huescaFlag },
                            { id: 'teruel', name: 'Teruel', flag: teruelFlag },
                            { id: 'zaragoza', name: 'Zaragoza', flag: zaragozaFlag }
                        ]
                    },
                    asturias: {
                        name: 'Asturias',
                        flag: asturiasFlag,
                        games: [
                            { id: 'asturias', name: 'Asturias', flag: asturiasFlag }
                        ]
                    },
                    balearic_islands: {
                        name: 'Islas Baleares',
                        flag: balearicFlag,
                        games: [
                            { id: 'balearic_islands', name: 'Islas Baleares (Municipios)', flag: balearicFlag },
                            { id: 'mallorca', name: 'Mallorca', flag: balearicFlag },
                            { id: 'menorca', name: 'Menorca', flag: balearicFlag },
                            { id: 'ibiza', name: 'Ibiza', flag: balearicFlag },
                            { id: 'formentera', name: 'Formentera', flag: balearicFlag }
                        ]
                    },
                    basque_country: {
                        name: 'País Vasco',
                        flag: basqueFlag,
                        games: [
                            { id: 'basque_country_provinces', name: 'Provincias del País Vasco', description: 'Identifica las 3 provincias de la comunidad', flag: basqueFlag },
                            { id: 'alava', name: 'Álava', flag: alavaFlag },
                            { id: 'biscay', name: 'Vizcaya', flag: biscayFlag },
                            { id: 'gipuzkoa', name: 'Guipúzcoa', flag: gipuzkoaFlag }
                        ]
                    },
                    cantabria: {
                        name: 'Cantabria',
                        flag: cantabriaFlag,
                        games: [
                            { id: 'cantabria', name: 'Cantabria', flag: cantabriaFlag }
                        ]
                    },
                    castile_and_leon: {
                        name: 'Castilla y León',
                        flag: castileAndLeonFlag,
                        games: [
                            { id: 'castile_and_leon_provinces', name: 'Provincias de Castilla y León', description: 'Identifica las 9 provincias de la comunidad', flag: castileAndLeonFlag },
                            { id: 'castile_and_leon_cities', name: 'Ciudades de Castilla y León', description: 'Ubica las principales ciudades de la comunidad', flag: castileAndLeonFlag },
                            { id: 'avila', name: 'Ávila', description: 'Ubica todos los municipios de la provincia de Ávila en el mapa', flag: avilaFlag },
                            { id: 'burgos', name: 'Burgos', description: 'Ubica todos los municipios de la provincia de Burgos en el mapa', flag: burgosFlag },
                            { id: 'leon', name: 'León', description: 'Ubica todos los municipios de la provincia de León en el mapa', flag: leonFlag },
                            { id: 'palencia', name: 'Palencia', description: 'Ubica todos los municipios de la provincia de Palencia en el mapa', flag: palenciaFlag },
                            { id: 'salamanca', name: 'Salamanca', description: 'Ubica todos los municipios de la provincia Salamanca en el mapa', flag: salamancaFlag },
                            { id: 'segovia', name: 'Segovia', description: 'Ubica todos los municipios de la provincia Segovia en el mapa', flag: segoviaFlag },
                            { id: 'soria', name: 'Soria', description: 'Ubica todos los municipios de la provincia Soria en el mapa', flag: soriaFlag },
                            { id: 'valladolid', name: 'Valladolid', description: 'Ubica todos los municipios de Valladolid en el mapa', flag: valladolidFlag },
                            { id: 'zamora', name: 'Zamora', description: 'Ubica todos los municipios de Zamora en el mapa', flag: zamoraFlag },
                            { id: 'valladolid_districts', name: 'Barrios de Valladolid', description: 'Localiza los diferentes barrios de la ciudad de Valladolid', flag: valladolidCityFlag },
                        ]
                    },
                    castile_la_mancha: {
                        name: 'Castilla-La Mancha',
                        flag: castileLaManchaFlag,
                        games: [
                            { id: 'castile_la_mancha_provincias', name: 'Provincias de Castilla-La Mancha', flag: castileLaManchaFlag },
                            { id: 'albacete', name: 'Albacete', flag: albaceteFlag },
                            { id: 'ciudad_real', name: 'Ciudad Real', flag: ciudadRealFlag },
                            { id: 'cuenca', name: 'Cuenca', flag: cuencaFlag },
                            { id: 'guadalajara', name: 'Guadalajara', flag: guadalajaraFlag },
                            { id: 'toledo', name: 'Toledo', flag: toledoFlag }
                        ]
                    },
                    catalonia: {
                        name: 'Cataluña',
                        flag: cataloniaFlag,
                        games: [
                            { id: 'catalonia_provinces', name: 'Provincias de Cataluña', flag: cataloniaFlag },
                            { id: 'barcelona', name: 'Barcelona', flag: barcelonaFlag },
                            { id: 'girona', name: 'Girona', flag: gironaFlag },
                            { id: 'lleida', name: 'Lleida', flag: lleidaFlag },
                            { id: 'tarragona', name: 'Tarragona', flag: tarragonaFlag }
                        ]
                    },
                    extremadura: {
                        name: 'Extremadura',
                        flag: extremaduraFlag,
                        games: [
                            { id: 'extremadura_provinces', name: 'Provincias de Extremadura', flag: extremaduraFlag },
                            { id: 'badajoz', name: 'Badajoz', flag: badajozFlag },
                            { id: 'caceres', name: 'Cáceres', flag: caceresFlag }
                        ]
                    },
                    galicia: {
                        name: 'Galicia',
                        flag: galiciaFlag,
                        games: [
                            { id: 'galicia_provinces', name: 'Provincias de Galicia', flag: galiciaFlag },
                            { id: 'a_coruña', name: 'A Coruña', flag: corunaFlag },
                            { id: 'lugo', name: 'Lugo', flag: lugoFlag },
                            { id: 'ourense', name: 'Ourense', flag: ourenseFlag },
                            { id: 'pontevedra', name: 'Pontevedra', flag: pontevedraFlag }
                        ]
                    },
                    la_rioja: {
                        name: 'La Rioja',
                        flag: laRiojaFlag,
                        games: [
                            { id: 'la_rioja', name: 'La Rioja', flag: laRiojaFlag }
                        ]
                    },
                    madrid_community: {
                        name: 'Comunidad de Madrid',
                        flag: madridFlag,
                        games: [
                            { id: 'madrid_community', name: 'Madrid (Municipios)', flag: madridFlag }
                        ]
                    },
                    murcia: {
                        name: 'Murcia',
                        flag: murciaFlag,
                        games: [
                            { id: 'murcia', name: 'Murcia', flag: murciaFlag }
                        ]
                    },
                    navarre: {
                        name: 'Navarra',
                        flag: navarraFlag,
                        games: [
                            { id: 'navarra', name: 'Navarra', flag: navarraFlag }
                        ]
                    },
                    valencian_community: {
                        name: 'Comunidad Valenciana',
                        flag: valenciaFlag,
                        games: [
                            { id: 'valencian_community_provinces', name: 'Provincias de la C. Valenciana', description: 'Identifica las 3 provincias de la comunidad', flag: valenciaFlag },
                            { id: 'valencia', name: 'Valencia', flag: valenciaFlag },
                            { id: 'alicante', name: 'Alicante', flag: alicanteFlag },
                            { id: 'castellon', name: 'Castellón', flag: castellonFlag }
                        ]
                    }
                }
            }
        }
    }
};

// Helper to find path for a game ID
// Returns [continentKey, countryKey, regionKey, gameName] or null
export const findGamePath = (gameId: string): { path: { label: string, url: string }[], gameName: string, flag?: string, regionId: string } | null => {
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
                        flag: game.flag,
                        regionId: regionKey
                    };
                }
            }
        }
    }
    return null;
};
