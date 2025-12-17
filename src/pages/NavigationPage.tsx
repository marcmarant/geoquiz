import { useParams, useNavigate } from 'react-router-dom';
import { WORLD_DATA } from '../data/navigation';
import Breadcrumb from '../components/ui/Breadcrumb';

interface NavigationPageProps {
    level: 'home' | 'continent' | 'country' | 'region';
}

const NavigationPage = ({ level }: NavigationPageProps) => {
    const { continent, country, region } = useParams<{ continent: string; country: string; region: string }>();
    const navigate = useNavigate();

    // Determine what to display based on level and params
    let items: { id: string; name: string; isGame?: boolean }[] = [];

    if (level === 'home') {
        items = Object.keys(WORLD_DATA).map(key => ({
            id: key,
            name: WORLD_DATA[key].name
        }));
    } else if (level === 'continent' && continent && WORLD_DATA[continent]) {
        const contData = WORLD_DATA[continent];
        items = Object.keys(contData.countries).map(key => ({
            id: key,
            name: contData.countries[key].name
        }));
    } else if (level === 'country' && continent && country && WORLD_DATA[continent]?.countries[country]) {
        const countryData = WORLD_DATA[continent].countries[country];
        items = Object.keys(countryData.regions).map(key => ({
            id: key,
            name: countryData.regions[key].name
        }));
    } else if (level === 'region' && continent && country && region) {
        const regionData = WORLD_DATA[continent]?.countries[country]?.regions[region];
        if (regionData) {
            items = regionData.games.map(game => ({
                id: game.id,
                name: game.name,
                isGame: true,
                flag: game.flag, // Add flag to item
                description: game.description
            }));
        }
    }

    const handleItemClick = (item: { id: string; isGame?: boolean }) => {
        if (item.isGame) {
            navigate(`/play/${item.id}`);
        } else {
            // Append current path
            const currentPath = window.location.pathname === '/' ? '' : window.location.pathname;
            navigate(`${currentPath}/${item.id}`);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-950">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

            {/* Fixed Breadcrumb for non-home pages */}
            {level !== 'home' && (
                <div className="fixed top-6 left-6 z-50">
                    <Breadcrumb />
                </div>
            )}

            <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center space-y-8 py-20">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-2">
                    Geography <span className="text-gradient">Quiz</span>
                </h1>

                {level === 'region' ? (
                    // Game Grid (Region Level)
                    <div className="w-full max-w-6xl">
                        <h2 className="text-3xl font-bold text-white mb-8 text-left border-l-4 border-indigo-500 pl-4">
                            Mapas disponibles
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleItemClick(item)}
                                    className="group relative flex flex-col overflow-hidden bg-slate-800/40 hover:bg-slate-700/60 border border-white/5 hover:border-indigo-500/50 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-indigo-500/20 text-left"
                                >
                                    {/* Image / Banner Area */}
                                    <div className="h-40 w-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 group-hover:from-indigo-600/30 group-hover:to-purple-600/30 transition-all flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-slate-950/20" />

                                        {/* Icon: Flag if available, else generic Shield */}
                                        {(item as any).flag ? (
                                            <img
                                                src={(item as any).flag}
                                                alt={item.name}
                                                className="h-28 w-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-400 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-6 flex flex-col gap-3">
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-slate-400 mt-1">
                                                {(item as any).description || `Identify municipalities in ${item.name}`}
                                            </p>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center w-full">
                                            <div className="flex flex-col">
                                                <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Mejor Puntuación</span>
                                                {(() => {
                                                    // Get Score
                                                    const savedScore = localStorage.getItem(`geoquiz_best_score_${item.id}`);
                                                    const scoreNum = savedScore ? parseFloat(savedScore) : null;

                                                    // Get Time
                                                    const savedTime = localStorage.getItem(`geoquiz_best_time_${item.id}`);
                                                    const timeMs = savedTime ? parseInt(savedTime, 10) : null;

                                                    // Determine Color
                                                    let colorClass = 'text-slate-500';
                                                    if (scoreNum !== null) {
                                                        if (scoreNum < 5) colorClass = 'text-red-500';
                                                        else if (scoreNum < 7) colorClass = 'text-yellow-400';
                                                        else colorClass = 'text-green-500';
                                                    }

                                                    // Format Time Helper
                                                    const fmtTime = (ms: number) => {
                                                        const totSec = Math.floor(ms / 1000);
                                                        const m = Math.floor(totSec / 60);
                                                        const s = totSec % 60;
                                                        return `${m}:${s.toString().padStart(2, '0')}`;
                                                    };

                                                    return (
                                                        <div className="flex items-baseline gap-2">
                                                            <span className={`text-lg font-mono font-bold ${colorClass}`}>
                                                                {scoreNum !== null ? scoreNum.toFixed(1) : '--'}
                                                            </span>
                                                            {scoreNum !== null && timeMs !== null && (
                                                                <span className="text-lg text-slate-500 font-mono font-medium">
                                                                    ({fmtTime(timeMs)})
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                            <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                                ➜
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    // Browsing List (Continent/Country Level)
                    <div className="glass-card p-8 rounded-2xl w-full max-w-md space-y-6">
                        <h2 className="text-2xl font-semibold text-indigo-300">Select {level.charAt(0).toUpperCase() + level.slice(1)}</h2>

                        <div className="grid grid-cols-1 gap-3">
                            {items.length > 0 ? (
                                items.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleItemClick(item)}
                                        className="group relative px-6 py-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 hover:border-indigo-500/50 transition-all duration-300 text-left flex items-center justify-between"
                                    >
                                        <span className="text-lg font-medium text-slate-200 group-hover:text-white">
                                            {item.name}
                                        </span>
                                        <span className="opacity-0 group-hover:opacity-100 text-indigo-400 transition-opacity">
                                            View →
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <div className="text-slate-400">No items found here.</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NavigationPage;
