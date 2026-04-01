import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, UserPlus } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/30 rounded-full mix-blend-screen filter blur-[120px] opacity-70 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-900/20 rounded-full mix-blend-screen filter blur-[120px] opacity-50 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center mt-10">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 mb-6 drop-shadow-lg">
          Welcome to <span className="text-blue-500">TalentMatch</span>
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          The futuristic recruitment platform connecting top-tier candidates with world-class companies faster and smarter than ever before.
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-8">
          {/* Action Button 1: Search Employee */}
          <Link 
            to="/candidates" 
            className="group relative w-full md:w-auto flex flex-col items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]"
          >
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all">
              <Users className="text-blue-400 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Search an Employee</h3>
            <p className="text-sm text-gray-400 text-center">Find verified and public talent</p>
          </Link>

          {/* Action Button 2: Search Job Vacancy */}
          <Link 
            to="/jobs" 
            className="group relative w-full md:w-auto flex flex-col items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]"
          >
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-500/30 transition-all">
              <Briefcase className="text-purple-400 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Search a Job Vacancy</h3>
            <p className="text-sm text-gray-400 text-center">Discover new career opportunities</p>
          </Link>

          {/* Action Button 3: Register/Login */}
          <Link 
            to="/auth" 
            className="group relative w-full md:w-auto flex flex-col items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.4)]"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all">
              <UserPlus className="text-emerald-400 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Register / Login</h3>
            <p className="text-sm text-gray-400 text-center">Join the platform to get started</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
