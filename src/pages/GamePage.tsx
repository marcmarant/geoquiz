import { useParams, Link, useNavigate } from 'react-router-dom';
import MapGame from '../components/MapGame';
import { useGame } from '../hooks/useGame';
import { findGamePath } from '../data/navigation';
import { useEffect, useState } from 'react';

const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const GamePage = () => {
    // Route: /play/:gameId
    const { gameId } = useParams<{ gameId: string }>();
    const navigate = useNavigate();

    // Pass 'gameId' as the ID to useGame
    const { geoData, backgroundData, gameState, handleGuess } = useGame(gameId!);

    const [elapsed, setElapsed] = useState(0);

    // Timer Logic
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (gameState.gameStatus === 'playing' && gameState.startTime) {
            // Update timer every second for display
            interval = setInterval(() => {
                setElapsed(Date.now() - gameState.startTime!);
            }, 1000);
        } else if (gameState.gameStatus === 'won' && gameState.startTime && gameState.endTime) {
            // Fix final time
            setElapsed(gameState.endTime - gameState.startTime);
        }
        return () => clearInterval(interval);
    }, [gameState.gameStatus, gameState.startTime, gameState.endTime]);

    const gameInfo = gameId ? findGamePath(gameId) : null;
    const formattedProvince = gameInfo ? gameInfo.gameName : gameId?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const flagUrl = gameInfo?.flag;

    // Calculate Grade (0-10)
    const maxPotentialPoints = gameState.total; // Assuming 1 pt per target is max
    const finalGrade = maxPotentialPoints > 0 ? (gameState.points / maxPotentialPoints) * 10 : 0;
    const formattedGrade = finalGrade.toFixed(1);

    // Map Style State
    const [mapStyle, setMapStyle] = useState<'dark' | 'light' | 'satellite'>(() => {
        const saved = localStorage.getItem('geoquiz_map_style');
        return (saved === 'dark' || saved === 'light' || saved === 'satellite') ? saved : 'dark';
    });
    const [showLayers, setShowLayers] = useState(false);

    useEffect(() => {
        localStorage.setItem('geoquiz_map_style', mapStyle);
    }, [mapStyle]);

    const styles = {
        dark: 'Oscuro',
        light: 'Claro',
        satellite: 'Satélite'
    };

    // Victory Modal State
    const [victoryModalOpen, setVictoryModalOpen] = useState(false);

    useEffect(() => {
        if (gameState.gameStatus === 'won') {
            setVictoryModalOpen(true);
        }
    }, [gameState.gameStatus]);

    return (
        <div className="relative h-screen w-full bg-slate-900 overflow-hidden flex flex-col">
            {/* Header / Overlay UI */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50">
                {/* Top Bar Container */}
                <div className="absolute top-0 left-0 w-full p-4 z-50">
                    <div className="container mx-auto relative flex flex-col md:flex-row justify-between items-start gap-4 h-full">

                        {/* Top Row: Back Button & Stats */}
                        <div className="w-full flex justify-between items-start pointer-events-auto">
                            {/* Left: Back Button */}
                            <button
                                onClick={() => navigate(-1)}
                                className="px-4 py-2 md:px-6 md:py-3 bg-slate-800/80 hover:bg-slate-700/90 backdrop-blur-md border border-white/10 rounded-xl text-white font-medium transition-all shadow-lg hover:shadow-xl flex items-center gap-2 text-sm md:text-base"
                            >
                                <span>←</span>
                                <span className="hidden sm:inline">Volver</span>
                            </button>

                            {/* Right: Stats & Flag */}
                            <div className="flex items-center gap-2 md:gap-4">
                                {gameState.gameStatus !== 'loading' && (
                                    <div className="flex gap-2 md:gap-3">
                                        {/* Timer */}
                                        <div className="px-3 py-2 md:px-5 md:py-2.5 rounded-xl bg-slate-800/80 backdrop-blur-md border border-white/10 shadow-lg flex flex-col items-center min-w-[60px] md:min-w-[80px]">
                                            <span className="text-[8px] md:text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tiempo</span>
                                            <span className="text-base md:text-xl font-mono font-bold text-indigo-400 leading-none mt-0.5">
                                                {formatTime(elapsed)}
                                            </span>
                                        </div>
                                        {/* Progress */}
                                        <div className="px-3 py-2 md:px-5 md:py-2.5 rounded-xl bg-slate-800/80 backdrop-blur-md border border-white/10 shadow-lg flex flex-col items-center min-w-[60px] md:min-w-[80px]">
                                            <span className="text-[8px] md:text-[10px] uppercase font-bold text-slate-400 tracking-wider">Progreso</span>
                                            <span className="text-base md:text-xl font-mono font-bold text-emerald-400 leading-none mt-0.5">
                                                {gameState.score}/{gameState.total}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {flagUrl && (
                                    <img
                                        src={flagUrl}
                                        alt={`${formattedProvince} Flag`}
                                        className="hidden md:block h-20 w-auto object-contain drop-shadow-2xl rounded-md"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Message (Mobile/Tablet Bottom, Desktop Top Center) */}
                <div className="fixed bottom-24 lg:bottom-auto lg:top-4 left-1/2 -translate-x-1/2 max-w-[90%] w-auto pointer-events-auto z-40 transition-all">
                    <div className="px-6 py-3 lg:px-10 lg:py-4 rounded-xl lg:rounded-full bg-slate-900/90 backdrop-blur-md border border-white/20 shadow-2xl text-center min-w-[200px] lg:min-w-[300px]">
                        <span className="text-lg lg:text-xl font-bold text-white tracking-wide break-words">
                            {gameState.message}
                        </span>
                    </div>
                </div>

                {/* Layer Switcher (Desktop: Bottom Left Horizontal) */}
                <div className="absolute bottom-6 left-6 pointer-events-auto hidden lg:flex gap-1 p-1 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 z-50">
                    {(Object.keys(styles) as Array<keyof typeof styles>).map((styleKey) => (
                        <button
                            key={styleKey}
                            onClick={() => setMapStyle(styleKey)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${mapStyle === styleKey
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {styles[styleKey]}
                        </button>
                    ))}
                </div>

                {/* Layer Switcher (Mobile/Tablet: Bottom Left Circular Button) */}
                <div className="absolute bottom-6 left-6 pointer-events-auto lg:hidden flex flex-col-reverse items-start gap-2 z-50">
                    {/* Toggle Button */}
                    <button
                        onClick={() => setShowLayers(!showLayers)}
                        className="p-3 bg-slate-900/90 backdrop-blur-md border border-white/20 rounded-full text-white shadow-xl hover:bg-slate-800 transition-all active:scale-95"
                        aria-label="Change Map Layer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
                        </svg>
                    </button>

                    {/* Options List (Since flex-col-reverse, this appears ABOVE the button) */}
                    {showLayers && (
                        <div className="flex flex-col gap-1 p-1 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 mb-2 animate-in fade-in slide-in-from-bottom-2">
                            {(Object.keys(styles) as Array<keyof typeof styles>).map((styleKey) => (
                                <button
                                    key={styleKey}
                                    onClick={() => { setMapStyle(styleKey); setShowLayers(false); }}
                                    className={`px-3 py-2 text-xs font-bold rounded-md transition-all text-left ${mapStyle === styleKey
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {styles[styleKey]}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Victory Overlay */}
            {gameState.gameStatus === 'won' && victoryModalOpen && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
                    <div className="glass-card relative p-10 rounded-3xl text-center space-y-6 max-w-md animate-in fade-in zoom-in duration-500 bg-slate-900/90 border border-white/10">
                        {/* Close Button */}
                        <button
                            onClick={() => setVictoryModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-2"
                            aria-label="Close Victory Modal"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                            ¡Victoria!
                        </h1>
                        <p className="text-slate-300 text-lg">
                            Has completado el mapa de {formattedProvince}.
                        </p>

                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="flex flex-col p-4 bg-slate-800/50 rounded-xl border border-white/5">
                                <span className="text-slate-400 text-sm uppercase font-bold">Tiempo</span>
                                <span className="text-2xl font-mono text-white">{formatTime(elapsed)}</span>
                            </div>
                            <div className="flex flex-col p-4 bg-slate-800/50 rounded-xl border border-white/5">
                                <span className="text-slate-400 text-sm uppercase font-bold">Nota</span>
                                <span className={`text-3xl font-bold ${Number(formattedGrade) < 5 ? 'text-red-500' :
                                    Number(formattedGrade) < 7 ? 'text-yellow-400' : 'text-green-500'
                                    }`}>
                                    {formattedGrade}
                                </span>
                                <span className="text-xs text-slate-500">sobre 10</span>
                            </div>
                        </div>

                        <Link to="/" className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg transition-all transform hover:scale-105">
                            Elegir otra provincia
                        </Link>
                    </div>
                </div>
            )}

            {/* Map Area */}
            <div className="flex-1 w-full h-full relative z-0">
                <MapGame
                    geoData={geoData}
                    backgroundData={backgroundData}
                    onMunicipalityClick={handleGuess}
                    gameState={gameState}
                    mapStyle={mapStyle}
                />
            </div>
        </div>
    );
};

export default GamePage;
