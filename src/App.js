// import logo from './logo.svg';
import './App.css';
import ReadMD from './pages/ReadMD';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ColorManagement from './pages/ColorManagement';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to the Basic React App</h1>
          <p>This is a simple page created with React.</p>
          <Routes>
            <Route path="/color" element={<ColorManagement />} />
            <Route path="/" element={<ReadMD />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
