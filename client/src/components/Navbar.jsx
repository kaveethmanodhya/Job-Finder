import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed w-full top-0 z-50 backdrop-blur-md bg-slate-900/50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex flex-1 items-center justify-start">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">
                TalentMatch
              </span>
            </Link>
          </div>
          
          {/* Main Links */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex space-x-8">
              <Link to="/" className="text-gray-300 hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.8)] px-3 py-2 rounded-md text-sm font-medium transition-all duration-300">
                Find Candidates
              </Link>
              <Link to="#" className="text-gray-300 hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.8)] px-3 py-2 rounded-md text-sm font-medium transition-all duration-300">
                Find Companies
              </Link>
            </div>
          </div>

          {/* Auth & User Section */}
          <div className="hidden md:flex flex-1 justify-end items-center space-x-6">
            <Link to="#" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
              Login
            </Link>
            <button className="bg-blue-600/80 text-white border border-blue-500/50 px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Register
            </button>
            
            {/* My Account Avatar */}
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex justify-center items-center overflow-hidden hover:border-blue-400/50 hover:shadow-[0_0_15px_rgba(96,165,250,0.4)] transition-all duration-300">
                <User className="w-5 h-5 text-gray-300 group-hover:text-blue-300 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
