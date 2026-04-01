import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchPage from './pages/SearchPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="bg-slate-950 min-h-screen text-white font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<SearchPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
