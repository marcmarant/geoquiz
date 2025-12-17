import { Link, useLocation, useParams } from 'react-router-dom';
import { findGamePath, WORLD_DATA } from '../../data/navigation';

const Breadcrumb = () => {
    const location = useLocation();
    const { gameId } = useParams<{ gameId: string }>();

    // Capitalize helper
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ');

    let items: { label: string, url?: string }[] = [];

    if (location.pathname.startsWith('/play/') && gameId) {
        // Reverse lookup
        const found = findGamePath(gameId);
        if (found) {
            items = [
                { label: 'Home', url: '/' },
                ...found.path,
                { label: found.gameName } // Current item, no URL
            ];
        } else {
            // Fallback
            items = [{ label: 'Home', url: '/' }, { label: 'Game' }];
        }
    } else {
        // Standard browsing (Navigation Pages)
        const pathnames = location.pathname.split('/').filter((x) => x);
        items.push({ label: 'Home', url: '/' });

        let currentScope: any = WORLD_DATA;

        pathnames.forEach((segment, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            let displayName = capitalize(segment);

            // Resolve Name based on depth
            if (index === 0) { // Continent
                if (WORLD_DATA[segment]) {
                    displayName = WORLD_DATA[segment].name;
                    currentScope = WORLD_DATA[segment];
                } else {
                    currentScope = null;
                }
            } else if (index === 1) { // Country
                if (currentScope && currentScope.countries && currentScope.countries[segment]) {
                    displayName = currentScope.countries[segment].name;
                    currentScope = currentScope.countries[segment];
                } else {
                    currentScope = null;
                }
            } else if (index === 2) { // Region
                if (currentScope && currentScope.regions && currentScope.regions[segment]) {
                    displayName = currentScope.regions[segment].name;
                    currentScope = currentScope.regions[segment];
                } else {
                    currentScope = null;
                }
            }

            items.push({
                label: displayName,
                url: index === pathnames.length - 1 ? undefined : to
            });
        });
    }

    return (
        <nav className="flex items-center text-sm font-medium text-slate-400 mb-4 bg-slate-800/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 w-fit">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return (
                    <div key={index} className="flex items-center">
                        {index > 0 && <span className="mx-2 text-slate-600">/</span>}
                        {isLast || !item.url ? (
                            <span className="text-white font-semibold">
                                {item.label}
                            </span>
                        ) : (
                            <Link to={item.url} className="hover:text-white transition-colors">
                                {item.label}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;
