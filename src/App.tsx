import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GamePage from './pages/GamePage';
import NavigationPage from './pages/NavigationPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Navigation Routes */}
        <Route path="/" element={<NavigationPage level="home" />} />
        <Route path="/:continent" element={<NavigationPage level="continent" />} />
        <Route path="/:continent/:country" element={<NavigationPage level="country" />} />
        <Route path="/:continent/:country/:region" element={<NavigationPage level="region" />} />

        {/* Game Route */}
        <Route path="/play/:gameId" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
