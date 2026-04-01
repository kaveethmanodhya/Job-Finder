import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import JobSearchPage from './pages/JobSearchPage';
import AuthPage from './pages/AuthPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="bg-slate-950 min-h-screen text-white font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/candidates" element={<SearchPage />} />
          <Route path="/jobs" element={<JobSearchPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
