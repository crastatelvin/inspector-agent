// Author: Telvin Crasta | CC BY-NC 4.0
import './styles/globals.css';
import MatrixRain from './components/MatrixRain';
import ReviewPage from './pages/ReviewPage';

export default function App() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <MatrixRain />
      <ReviewPage />
    </div>
  );
}
