import { useState, useEffect, useCallback } from 'react';
import type { FeatureCollection } from 'geojson';
import { findGamePath } from '../data/navigation';

export interface GameState {
    score: number; // Count of found municipalities
    total: number;
    currentTarget: string | null;
    gameStatus: 'loading' | 'playing' | 'won';
    answers: Record<string, 'correct' | 'incorrect' | 'correct-1' | 'correct-2' | 'correct-3' | 'blinking'>;
    message: string;
    startTime: number | null;
    endTime: number | null;
    points: number; // Accumulated score value
}

export const useGame = (provinceId: string) => {
    const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
    const [backgroundData, setBackgroundData] = useState<FeatureCollection | null>(null);
    // const [allMunicipios, setAllMunicipios] = useState<string[]>([]); // Removed unused state
    const [remainingTargets, setRemainingTargets] = useState<string[]>([]);
    const [attempts, setAttempts] = useState(0);

    const [gameState, setGameState] = useState<GameState>({
        score: 0,
        total: 0,
        currentTarget: null,
        gameStatus: 'loading',
        answers: {},
        message: 'Loading...',
        startTime: null,
        endTime: null,
        points: 0
    });

    // Load data
    useEffect(() => {
        const loadData = async () => {
            try {
                setGameState(prev => ({ ...prev, gameStatus: 'loading', message: 'Loading map data...' }));

                let data;
                let bgData = null;

                const gameInfo = findGamePath(provinceId);
                if (!gameInfo || !gameInfo.regionId) {
                    throw new Error(`Game path not found for ${provinceId}`);
                }

                const regionId = gameInfo.regionId;
                // Construct URL based on public folder structure: /europe/spain/<region>/<id>.json
                // We must respect the BASE_URL defined in vite.config.ts (e.g. /geoquiz/)
                const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
                const url = `${baseUrl}europe/spain/${regionId}/${provinceId}.json`;

                const response = await fetch(url);
                if (!response.ok) throw new Error(`Failed to load map data: ${response.statusText}`);
                data = await response.json();


                // Special case for background data
                if (provinceId === 'castile_and_leon_cities') {
                    // Background is the provinces map
                    // Located at /europe/spain/castile_and_leon/castile_and_leon_provinces.json
                    const bgUrl = `${baseUrl}europe/spain/castile_and_leon/castile_and_leon_provinces.json`;
                    const bgResponse = await fetch(bgUrl);
                    if (bgResponse.ok) {
                        bgData = await bgResponse.json();
                    }
                }

                const fc = data as FeatureCollection;
                const bgFc = bgData ? (bgData as FeatureCollection) : null;

                // Normalize features to ensure they have a 'name' property
                const normalizedFeatures = fc.features.map(f => {
                    // Check possible name fields
                    const name = f.properties?.NAMEUNIT || f.properties?.name || f.properties?.NOMBRE_BAR;

                    if (f.properties) {
                        // Ensure name is set for MapGame to use (if it falls back to .name)
                        // MapGame prioritization: NAMEUNIT || name
                        // We set 'name' so it picks it up if NAMEUNIT is missing.
                        f.properties.name = name;
                    }
                    return f;
                });

                // Extract unique names
                const names = [...new Set(normalizedFeatures
                    .map(f => f.properties?.name)
                    .filter((n): n is string => !!n))];

                setGeoData(fc);
                setBackgroundData(bgFc);
                // setAllMunicipios(names);
                setRemainingTargets([...names]); // Careful with reference, spread creates new array
                setGameState(prev => ({
                    ...prev,
                    total: names.length,
                    gameStatus: 'playing',
                    message: 'Game Ready!',
                    startTime: Date.now(),
                    endTime: null,
                    points: 0,
                    score: 0,
                    answers: {}
                }));

                // Pick first target
                pickNewTarget([...names]);

            } catch (error) {
                console.error("Error loading data:", error);
                setGameState(prev => ({ ...prev, message: 'Error loading data.' }));
            }
        };

        if (provinceId) {
            loadData();
        }
    }, [provinceId]);

    const pickNewTarget = useCallback((remaining: string[]) => {
        setAttempts(0); // Reset attempts
        if (remaining.length === 0) {
            setGameState(prev => ({
                ...prev,
                currentTarget: null,
                gameStatus: 'won',
                message: '¡Felicidades! ¡Has encontrado todos los municipios!',
                endTime: Date.now()
            }));
            return;
        }
        const randomIndex = Math.floor(Math.random() * remaining.length);
        const newTarget = remaining[randomIndex];
        setGameState(prev => ({
            ...prev,
            currentTarget: newTarget,
            message: `Busca: ${newTarget}`
        }));
    }, []);

    const handleGuess = useCallback((name: string) => {
        if (gameState.gameStatus !== 'playing' || !gameState.currentTarget) return;

        const isCorrect = name === gameState.currentTarget;

        if (isCorrect) {
            // Correct guess
            let status: 'correct' | 'correct-1' | 'correct-2' | 'correct-3' = 'correct';
            let pointsEarned = 1;

            if (attempts === 1) { status = 'correct-1'; pointsEarned = 0.66; }
            if (attempts === 2) { status = 'correct-2'; pointsEarned = 0.33; }
            if (attempts >= 3) { status = 'correct-3'; pointsEarned = 0; }

            const newAnswers = { ...gameState.answers, [name]: status };
            // Remove from remaining
            const newRemaining = remainingTargets.filter(t => t !== name);
            setRemainingTargets(newRemaining);

            let nextTarget: string | null = gameState.currentTarget;
            let nextStatus: GameState['gameStatus'] = gameState.gameStatus;
            let nextMessage = "¡Correcto!";
            let nextEndTime = gameState.endTime;

            if (newRemaining.length === 0) {
                nextStatus = 'won';
                nextMessage = "¡Victoria! ¡Has completado el mapa!";
                nextTarget = null;
                nextEndTime = Date.now();

                // Save Best Score (and Time)
                const finalPoints = gameState.points + pointsEarned;
                const totalPossible = gameState.total;
                const finalGrade = totalPossible > 0 ? (finalPoints / totalPossible) * 10 : 0;
                const elapsedTime = nextEndTime! - gameState.startTime!;

                const scoreKey = `geoquiz_best_score_${provinceId}`;
                const timeKey = `geoquiz_best_time_${provinceId}`;

                const savedBestStr = localStorage.getItem(scoreKey);
                const savedTimeStr = localStorage.getItem(timeKey);

                const currentBest = savedBestStr ? parseFloat(savedBestStr) : -1;
                const currentTime = savedTimeStr ? parseInt(savedTimeStr, 10) : Infinity;

                // Update if better grade, OR equal grade but faster time
                if (finalGrade > currentBest || (Math.abs(finalGrade - currentBest) < 0.01 && elapsedTime < currentTime)) {
                    localStorage.setItem(scoreKey, finalGrade.toFixed(1));
                    localStorage.setItem(timeKey, elapsedTime.toString());
                }
            } else {
                const randomIndex = Math.floor(Math.random() * newRemaining.length);
                nextTarget = newRemaining[randomIndex];
                nextMessage = `Busca: ${nextTarget}`;
            }

            setGameState(prev => ({
                ...prev,
                score: prev.score + 1,
                points: prev.points + pointsEarned,
                answers: newAnswers,
                currentTarget: nextTarget,
                gameStatus: nextStatus,
                message: nextMessage,
                endTime: nextEndTime
            }));
            setAttempts(0);

        } else {
            // Incorrect guess
            if (gameState.answers[name] && gameState.answers[name].startsWith('correct')) return;

            setAttempts(prev => prev + 1);

            setGameState(prev => {
                const newAnswers = { ...prev.answers, [name]: 'incorrect' as const };

                // If this is the 3rd failure (attempts will become 3), highlight target
                if (attempts === 2) {
                    newAnswers[prev.currentTarget!] = 'blinking' as const;
                }

                return {
                    ...prev,
                    answers: newAnswers
                };
            });

            // Flash effect: remove incorrect status after delay
            setTimeout(() => {
                setGameState(prev => {
                    if (prev.answers[name] === 'incorrect') {
                        const { [name]: _, ...rest } = prev.answers;
                        return { ...prev, answers: rest };
                    }
                    return prev;
                });
            }, 1000);
        }
    }, [gameState, attempts, remainingTargets]);

    return {
        geoData,
        backgroundData,
        gameState,
        handleGuess
    };
};
