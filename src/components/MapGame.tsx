import { MapContainer, TileLayer, GeoJSON, useMap, CircleMarker, Pane, Tooltip } from 'react-leaflet';
import React, { useEffect, useState, useRef } from 'react';
import type { FeatureCollection } from 'geojson';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { GameState } from '../hooks/useGame';

interface MapGameProps {
    onMunicipalityClick: (name: string) => void;
    gameState: GameState;
    mapStyle: 'dark' | 'light' | 'satellite';
}

// Component to adjust map view to fit bounds
const MapAdjuster = ({ data }: { data: FeatureCollection | null }) => {
    const map = useMap();

    useEffect(() => {
        if (data && data.features.length > 0) {
            const geoJsonLayer = L.geoJSON(data);
            const bounds = geoJsonLayer.getBounds();
            map.fitBounds(bounds);

            // Dynamically set minZoom based on the bounds of the game data
            const fitZoom = map.getBoundsZoom(bounds);
            // Restrict zooming out so the map always covers the view (or at least fits bounds)
            map.setMinZoom(Math.max(2, fitZoom));

            // Restrict panning to the bounds of the game data with a little padding
            map.setMaxBounds(bounds.pad(0.2));
        }
    }, [data, map]);

    return null;
};

// Helper component for Points (Pins)
const PointFeature = ({ feature, gameState, onClick }: { feature: any, gameState: GameState, onClick: (name: string) => void }) => {
    const name = feature.properties?.NAMEUNIT || feature.properties?.name;
    const coords = feature.geometry.coordinates;
    const latlng: L.LatLngExpression = [coords[1], coords[0]];

    const [isHovered, setIsHovered] = useState(false);
    const markerRef = useRef<any>(null); // Ref for visual marker

    const status = gameState.answers[name];
    const isAnswered = status && status.startsWith('correct');

    let color = '#3b82f6';
    let opacity = 0.8;

    if (status === 'correct') color = '#22c5e0';
    else if (status === 'correct-1') color = '#eab308';
    else if (status === 'correct-2') color = '#f97316';
    else if (status === 'correct-3') color = '#ef4444';
    else if (status === 'incorrect') color = '#ef4444';
    else if (status === 'blinking') color = '#ef4444';

    // Manually handle class for reliability
    useEffect(() => {
        if (markerRef.current) {
            const el = markerRef.current.getElement();
            if (el) {
                if (status === 'blinking') el.classList.add('blink-animation');
                else el.classList.remove('blink-animation');
            }
        }
    }, [status]);

    // Scale visual circle on hover (if not answered)
    const radius = isHovered && !isAnswered ? 10 : 6;
    const weight = isHovered && !isAnswered ? 3 : 1;
    const finalColor = (isHovered && !isAnswered) ? '#60a5fa' : color;

    return (
        <React.Fragment>
            {/* Interaction Area (Invisible but clickable) */}
            <CircleMarker
                center={latlng}
                radius={20}
                pathOptions={{ stroke: false, fillOpacity: 0 }}
                eventHandlers={{
                    click: () => onClick(name),
                    mouseover: () => setIsHovered(true),
                    mouseout: () => setIsHovered(false)
                }}
            />
            {/* Visual Marker */}
            <CircleMarker
                ref={markerRef}
                center={latlng}
                radius={radius}
                pathOptions={{
                    color: 'white',
                    fillColor: finalColor,
                    fillOpacity: opacity,
                    weight: weight
                }}
                interactive={false}
            >
                {/* Tooltip for Incorrect Guess */}
                {status === 'incorrect' && (
                    <Tooltip permanent direction="top" offset={[0, -10]} className="font-bold text-red-600 bg-white border-2 border-red-500 rounded-md shadow-lg z-[1000]">
                        {name}
                    </Tooltip>
                )}
            </CircleMarker>
        </React.Fragment>
    );
};

// Helper component for Polygons (Surfaces)
const PolygonFeature = ({ feature, gameState, onClick }: { feature: any, gameState: GameState, onClick: (name: string) => void }) => {
    const name = feature.properties?.NAMEUNIT || feature.properties?.name;
    const status = gameState.answers[name];
    const isAnswered = status && status.startsWith('correct');

    const [isHovered, setIsHovered] = useState(false);
    const layerRef = useRef<any>(null);

    let color = '#3b82f6';
    let fillOpacity = 0.5;

    if (status === 'correct') { color = '#22c5e0'; fillOpacity = 0.8; }
    else if (status === 'correct-1') { color = '#eab308'; fillOpacity = 0.8; }
    else if (status === 'correct-2') { color = '#f97316'; fillOpacity = 0.8; }
    else if (status === 'correct-3') { color = '#ef4444'; fillOpacity = 0.8; }
    else if (status === 'incorrect') { color = '#ef4444'; fillOpacity = 0.8; }
    else if (status === 'blinking') { color = '#ef4444'; fillOpacity = 0.8; }

    useEffect(() => {
        if (layerRef.current) {
            const layers = layerRef.current.getLayers();
            if (layers.length > 0) {
                const layer = layers[0];
                const el = layer.getElement();
                if (el) {
                    if (status === 'blinking') el.classList.add('blink-animation');
                    else el.classList.remove('blink-animation');
                }
            }
        }
    }, [status]);

    const currentStyle = {
        fillColor: (isHovered && !isAnswered) ? '#60a5fa' : color,
        weight: (isHovered && !isAnswered) ? 2 : 1,
        opacity: 1,
        color: (isHovered && !isAnswered) ? '#415db9ff' : 'white', // Dark blue on hover
        fillOpacity: (isHovered && !isAnswered) ? 0.7 : fillOpacity
    };

    return (
        <GeoJSON
            ref={layerRef}
            data={feature}
            style={currentStyle}
            eventHandlers={{
                click: () => onClick(name),
                mouseover: (e) => {
                    setIsHovered(true);
                    if (!isAnswered) e.target.bringToFront();
                },
                mouseout: () => {
                    setIsHovered(false);
                }
            }}
        >
            {status === 'incorrect' && (
                <Tooltip permanent direction="center" className="font-bold text-red-600 bg-white border-2 border-red-500 rounded-md shadow-lg z-[1000]">
                    {name}
                </Tooltip>
            )}
        </GeoJSON>
    );
};

const MapGame = ({ onMunicipalityClick, gameState, geoData, backgroundData, mapStyle }: MapGameProps & { geoData: FeatureCollection | null, backgroundData: FeatureCollection | null }) => {

    const backgroundStyle = {
        fillColor: 'transparent',
        color: '#64748b',
        weight: 1,
        opacity: 0.5,
        fillOpacity: 0
    };

    // Removed internal mapStyle state

    const styles = {
        dark: {
            url: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            bg: '#1a1a1a',
            label: 'Oscuro'
        },
        light: {
            url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            bg: '#f8fafc',
            label: 'Claro'
        },
        satellite: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            bg: '#0f172a',
            label: 'Satélite'
        }
    };

    const currentMapStyle = styles[mapStyle];

    // Separate polygons and points
    const polygons: any[] = [];
    const points: any[] = [];

    // ... filtering logic ...

    if (geoData) {
        geoData.features.forEach((feature: any) => {
            if (feature.geometry.type === 'Point' || feature.geometry.type === 'MultiPoint') {
                points.push(feature);
            } else {
                polygons.push(feature);
            }
        });
    }

    return (
        <div className="h-full w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group">
            {/* Style Switcher Removed - Controlled by Parent */}

            <MapContainer
                center={[40.4637, -3.7492]}
                zoom={6}
                maxZoom={18}
                style={{ height: '100%', width: '100%', background: currentMapStyle.bg }}
                zoomControl={false}
            >
                <MapAdjuster data={geoData} />
                <TileLayer
                    attribution={currentMapStyle.attribution}
                    url={currentMapStyle.url}
                />

                {backgroundData && (
                    <GeoJSON
                        data={backgroundData}
                        style={backgroundStyle}
                        interactive={false}
                    />
                )}

                {/* Polygons (Default Pane) */}
                {polygons.map((feature: any, index: number) => (
                    <PolygonFeature
                        key={`${feature.properties?.NAMEUNIT || feature.properties?.name}-${index}`}
                        feature={feature}
                        gameState={gameState}
                        onClick={onMunicipalityClick}
                    />
                ))}

                {/* Points (Custom Pane - Higher Z-Index) */}
                <Pane name="points-pane" style={{ zIndex: 500 }}>
                    {points.map((feature: any, index: number) => (
                        <PointFeature
                            key={`${feature.properties?.NAMEUNIT || feature.properties?.name}-${index}`}
                            feature={feature}
                            gameState={gameState}
                            onClick={onMunicipalityClick}
                        />
                    ))}
                </Pane>
            </MapContainer>
        </div>
    );
};

export default MapGame;
